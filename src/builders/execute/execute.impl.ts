import { createBuilder, BuilderContext, BuilderOutput, targetFromTargetString, scheduleTargetAndForget } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { Observable, from, iif, of } from 'rxjs';
import { concatMap, tap, mapTo } from 'rxjs/operators';
import { fork } from 'child_process';

export interface LoopbackExecuteBuilderOptions extends JsonObject {
    appPath: string;
    NODE_ENV: string;
    args: string[];
    buildTarget: string;
    runOnly: boolean;
    clean: boolean;
}

export default createBuilder<LoopbackExecuteBuilderOptions>(
    loopbackExecuteBuilderHandler
);

function loopbackExecuteBuilderHandler(
    options: LoopbackExecuteBuilderOptions,
    context: BuilderContext
): Observable<BuilderOutput> {
    // skip building the typescript files
    if (options.runOnly) {
        return runProcess(options, context);
    }

    return startBuild(options, context).pipe(
        concatMap((event: BuilderOutput) => {
            if (!event.success) {
                context.logger.error(
                    'There was an error with the build. See above.'
                );
            }

            return handleBuildEvent(event, options, context).pipe(mapTo(event));
        }),
    );
}

function handleBuildEvent(
    event: BuilderOutput,
    options: LoopbackExecuteBuilderOptions,
    context: BuilderContext
): Observable<BuilderOutput | undefined> {
    return iif(
        () => !event.success,
        of(undefined),
        runProcess(options, context)
    );
}

function runProcess(options: LoopbackExecuteBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
    const observable = new Observable<BuilderOutput>((observer) => {
        const pid = runNodeServer(options, context);
        if (pid !== undefined)
            return observer.next({ success: true });

        return observer.next({ success: false });
    });

    return observable;
}

function runNodeServer(options: LoopbackExecuteBuilderOptions, _: BuilderContext): number {
    // setting the node env option by default it's development 
    const env = Object.create(process.env);
    const NODE_ENV = options.NODE_ENV || 'development';

    const child = fork(options.appPath, options.args, {
        execArgv: getExecArgv(options),
        env: {
            ...env,
            NODE_ENV,
        },
    });

    return child.pid;
}

function getExecArgv(_: LoopbackExecuteBuilderOptions) {
    return ['-r', 'source-map-support/register'];
}

function startBuild(
    options: LoopbackExecuteBuilderOptions,
    context: BuilderContext
): Observable<BuilderOutput> {
    const target = targetFromTargetString(options.buildTarget);
    return from(
        Promise.all([
            context.getTargetOptions(target),
            context.getBuilderNameForTarget(target)
        ]).then(([options, builderName]) =>
            context.validateOptions(options, builderName)
        )
    ).pipe(
        tap(options => {
            if (options.optimization) {
                context.logger.warn(stripIndents`
            ************************************************
            This is a simple process manager for use in
            testing or debugging Loopback applications locally.
            DO NOT USE IT FOR PRODUCTION!
            You should look into proper means of deploying
            your loopback application to production.
            ************************************************`);
            }
        }),
        concatMap(
            () =>
                scheduleTargetAndForget(
                    context,
                    target,
                    genBuildOverrides(options)
                ) as Observable<BuilderOutput>
        )
    );
}

function genBuildOverrides(options: LoopbackExecuteBuilderOptions): JsonObject {
    const overrides: JsonObject = {};

    if (options.clean) {
        overrides.clean = options.clean;
    }

    return overrides;
}