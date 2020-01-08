import { chain, Rule } from '@angular-devkit/schematics';
import {
    addDepsToPackageJson
} from '@nrwl/workspace';

export interface Schema {
    skipFormat: boolean;
}

function addDependencies(): Rule {
    return addDepsToPackageJson(
        {
            "@loopback/boot": "^1.6.0",
            "@loopback/context": "^1.25.0",
            "@loopback/core": "^1.12.0",
            "@loopback/openapi-v3": "^1.10.3",
            "@loopback/repository": "^1.16.0",
            "@loopback/rest": "^1.25.0",
            "@loopback/rest-explorer": "^1.4.6",
            "@loopback/service-proxy": "^1.3.13"
        },
        {
            "@loopback/build": "^3.0.0",
            "source-map-support": "^0.5.16",
            "@loopback/testlab": "^1.10.0",
            "@types/node": "^10.17.6",
            "@typescript-eslint/parser": "^2.10.0",
            "@typescript-eslint/eslint-plugin": "^2.10.0",
            "@loopback/eslint-config": "^5.0.0",
            "eslint": "^6.7.2",
            "eslint-config-prettier": "^6.7.0",
            "eslint-plugin-eslint-plugin": "^2.1.0",
            "eslint-plugin-mocha": "^6.2.2",
            "typescript": "~3.7.3"
        }
    );
}

export default function () {
    return chain([
        addDependencies(),
    ]);
}