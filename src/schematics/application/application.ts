import {
    apply,
    chain,
    mergeWith,
    move,
    Rule,
    SchematicContext,
    template,
    Tree,
    url
} from '@angular-devkit/schematics';
import { join, normalize, strings, Path } from '@angular-devkit/core';
import { toFileName, updateWorkspaceInTree } from '@nrwl/workspace';

import init from '../init/init';

export interface Schema {
    name: string;
    skipFormat: boolean;
    tags?: string;
}

interface NormalizedSchema extends Schema {
    appProjectRoot: Path;
    parsedTags: string[];
}

export default function (schema: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        const options = normalizeOptions(schema);
        return chain([
            init({
                skipFormat: options.skipFormat,
            }),
            addAppFiles(options),
            updateWorkspaceJson(options),
        ])(host, context);
    };
}

function normalizeOptions(options: Schema): NormalizedSchema {
    const appDirectory = toFileName(options.name);
    const appProjectName = appDirectory.replace(new RegExp('/', 'g'), '-');
    const appProjectRoot = join(normalize('apps'), appDirectory);
    const parsedTags = options.tags
        ? options.tags.split(',').map(s => s.trim())
        : [];

    return {
        ...options,
        name: toFileName(appProjectName),
        appProjectRoot,
        parsedTags
    };
}

function addAppFiles(options: NormalizedSchema): Rule {
    return mergeWith(
        apply(url(`./files`), [
            template({
                utils: strings,
                tmpl: '',
                name: options.name,
                root: options.appProjectRoot,
                dist: normalize('dist'),
            }),
            move(join(options.appProjectRoot)),
            move(
                join(options.appProjectRoot, 'src', 'tests'),
                join(options.appProjectRoot, 'src', '__tests__')
            ),
        ]),
    );
}

function getBuildConfig(project: any, options: NormalizedSchema) {
    return {
        builder: 'nx-loopback-next:build',
        options: {
            main: join(project.sourceRoot, 'index.js'),
            appPath: join(options.appProjectRoot),
            tsConfig: 'tsconfig.json',
        },
        configurations: {}
    };
}

function getServeConfig(options: NormalizedSchema) {
    return {
        builder: 'nx-loopback-next:execute',
        options: {
            buildTarget: `${options.name}:build`,
            appPath: join(options.appProjectRoot),
            NODE_ENV: 'development',
        }
    };
}

function updateWorkspaceJson(options: NormalizedSchema): Rule {
    return updateWorkspaceInTree(workspaceJson => {
        const project = {
            root: options.appProjectRoot,
            sourceRoot: join(options.appProjectRoot, 'src'),
            projectType: 'application',
            prefix: options.name,
            schematics: {},
            architect: <any>{}
        };

        project.architect.build = getBuildConfig(project, options);
        project.architect.serve = getServeConfig(options);
        // TODO: ADD LINTING SUPPORT
        // project.architect.lint = generateProjectLint(
        //     normalize(project.root),
        //     join(normalize(project.root), 'tsconfig.app.json'),
        //     options.linter
        // );

        workspaceJson.projects[options.name] = project;

        workspaceJson.defaultProject = workspaceJson.defaultProject || options.name;

        return workspaceJson;
    });
}
