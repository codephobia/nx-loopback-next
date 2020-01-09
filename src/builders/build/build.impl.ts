import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import * as childProcess from 'child_process';
import * as path from 'path';

export interface LoopbackBuildBuilderOptions extends JsonObject {
    appPath: string;
    tsConfig: string;
    clean: boolean;
}

export default createBuilder<LoopbackBuildBuilderOptions>((options, context): Promise<BuilderOutput> => {
    if (options.clean) {
        clean(options, context);
    }

    return build(options, context);
});

async function build(options: LoopbackBuildBuilderOptions, context: BuilderContext): Promise<BuilderOutput> {
    const lbResult = spawnLb(options, context);

    if (lbResult.stdout) {
        const info = Buffer.from(lbResult.stdout).toString('utf8');
        if (info.length) {
            context.logger.info(info);
        }
    }

    if (lbResult.stderr) {
        const err = Buffer.from(lbResult.stderr).toString('utf8');
        if (err.length) {
            context.logger.error(err);
        }
    }

    if (lbResult.status === 0) {
        context.logger.info('Typescript compiled successfully');
    }

    return { success: lbResult.status === 0 };
}

function spawnLb(options: LoopbackBuildBuilderOptions, context: BuilderContext) {
    return childProcess.spawnSync('npx', [
        'lb-tsc',
        '-p', `${options.tsConfig}`,
    ], {
        cwd: path.resolve(context.workspaceRoot, options.appPath),
        shell: true,
    });
}

function clean(options: LoopbackBuildBuilderOptions, context: BuilderContext) {
    return childProcess.spawnSync('npx', [
        'lb-clean',
        path.resolve(context.workspaceRoot, 'dist', options.appPath),
        path.resolve(context.workspaceRoot, 'dist', 'apps', 'tsconfig.tsbuildinfo'),
    ], {
        cwd: path.resolve(context.workspaceRoot),
        shell: true,
    });
}