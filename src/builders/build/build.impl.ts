import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import * as childProcess from 'child_process';

export interface Options extends JsonObject {
    /**
     * @description tsconfig.json path
     */
    tsConfig: string;
}

export default createBuilder<Options>((options, context): Promise<BuilderOutput> => {
    return build(options, context);
});

async function build(options: Options, context: BuilderContext): Promise<BuilderOutput> {
    const lbResult = spawnLb(options, context);

    if (lbResult.stdout) {
        context.logger.info(Buffer.from(lbResult.stdout).toString('utf8'));
    }

    if (lbResult.stderr) {
        context.logger.error(Buffer.from(lbResult.stderr).toString('utf8'));
    }

    if (lbResult.status === 0) {
        context.logger.info('Typescript compiled successfully');
    }

    return { success: lbResult.status === 0 };
}

function spawnLb(options: Options, context: BuilderContext) {
    return childProcess.spawnSync('npx', [
        'lb-tsc',
        '-p', `${options.tsConfig}`,
    ], {
        cwd: context.currentDirectory,
        shell: true,
    });
}