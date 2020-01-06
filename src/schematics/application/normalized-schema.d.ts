import { Path } from '@angular-devkit/core';

import { Schema } from './schema';

interface NormalizedSchema extends Schema {
    appProjectRoot: Path;
    parsedTags: string[];
}