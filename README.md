# nx-loopback-new

Create a [Loopback 4](https://loopback.io) application within your [Nx Monorepo](https://nrwl.io). This is more of a proof of concept, and may not be production ready. My hope is that Nrwl adds official support for Loopback within Nx. Pull requests are more than welcome.

## Install package

With Yarn:

`yarn add nx-loopback-new`

With NPM:

`npm i nx-loopback-new --save`

Github:

`npm i https://github.com/me-marcel/nx-loopback-new.git --save`

And then you must build the contents in your node_modules/nx-loopback-new with `yarn build`.

## Create a new application

With Nrwl CLI:

`nx g nx-loopback-new:app`

With Angular CLI:

`ng g nx-loopback-new:app`

## Schematics

### Init

Initializes the Nx monorepo to have dependencies for Loopback 4. This is a hidden schematic and should not ever need to be called.

#### Schema

| Name       | Type    | Required | Description                           |
|------------|---------|:--------:|---------------------------------------|
| skipFormat | boolean | false    | Not actually being used yet           |

### Application

Generates a new Loopback 4 application.

#### Schema

| Name       | Type    | Required | Description                           |
|------------|---------|:--------:|---------------------------------------|
| name       | string  | yes      | Name of the new application           |
| tags       | string  | no       | Comma separated tags used for linting |
| skipFormat | boolean | false    | Not actually being used yet           |

## Builders

### Build

Builds the application using lb-tsc.

With Nx CLI:

`nx build application-name`

With Angular CLI:

`ng build application-name`

#### Schema

| Name       | Type    | Default | Required | Description                                 |
|------------|---------|---------|:--------:|---------------------------------------------|
| appPath    | string  |         | yes      | Path the application. ie. apps/backend      |
| tsConfig   | string  |         | yes      | Path to the tsConfig.json file for Loopback |
| clean      | boolean | false   | no       | Delete dist files prior to build            |

### Execute

Runs the build application with Node.js.

With Nx CLI:

`nx serve application-name`

With Angular CLI:

`ng serve application-name`

#### Schema

| Name        | Type     | Default     | Required | Description                                  |
|-------------|----------|-------------|:--------:|----------------------------------------------|
| appPath     | string   |             | yes      | Path the application. ie. apps/backend       |
| NODE_ENV    | string   | development | no       | Node environment for the application         |
| args        | string[] | []          | no       | Arguments to add to the command              |
| buildTarget | string   |             | yes      | The Nx build command for the new application |
| runOnly     | boolean  | true        | no       | Skip the build before running                |
| clean       | boolean  | false       | no       | Delete dist files prior to build             |

## Features still missing

I would like to see the following features added to the project.

- Build with watch
- Linting
- Unit tests

## Shoutouts and Credit

I couldn't have built this without the following resources and wanted to make sure to note them:

- The official Nx github is a great resource for seeing how the team at Nrwl are building schematics and builders for Nx. [https://github.com/nrwl/nx](https://github.com/nrwl/nx)

- Abdooly wrote a custom builder for using ts-node. That repo was a massive help in understanding how to make a builder without using webpack. [https://github.com/abdoolly/ts-node-builder](https://github.com/abdoolly/ts-node-builder)

- Martin Raymond published the original generator code. [https://github.com/codephobia/nx-loopback-next](https://github.com/codephobia/nx-loopback-next)