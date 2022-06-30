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
            "@loopback/boot": "^5.0.1",
            "@loopback/context": "^5.0.1",
            "@loopback/core": "^4.0.1",
            "@loopback/openapi-v3": "^8.0.1",
            "@loopback/repository": "^5.0.1",
            "@loopback/rest": "^12.0.1",
            "@loopback/rest-explorer": "^5.0.1",
            "@loopback/service-proxy": "^5.0.1"
        },
        {
            "source-map-support": "^0.5.21",
            "@loopback/build": "^9.0.1",
            "@loopback/testlab": "^5.0.1",
            "@loopback/eslint-config": "^13.0.1",
            "typescript": "4.7.4",
            "@typescript-eslint/parser": "5.24.0",
            "@typescript-eslint/eslint-plugin": "5.24.0",
            "@types/node": "16.11.7",
            "eslint": "^8.17.0",
            "eslint-config-prettier": "8.1.0",
            "eslint-plugin-eslint-plugin": "^4.3.0",
            "eslint-plugin-mocha": "^10.0.5",
        }
    );
}

export default function (_: Schema) {
    return chain([
        addDependencies(),
    ]);
}