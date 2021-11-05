import { parse, print } from 'graphql';
import { migrateGraphQLSchema } from '../../schema-migrator';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ModelTransformer } from '@aws-amplify/graphql-model-transformer';
import { IndexTransformer, PrimaryKeyTransformer } from '@aws-amplify/graphql-index-transformer';
import {
  BelongsToTransformer,
  HasManyTransformer,
  HasOneTransformer,
  ManyToManyTransformer,
} from '@aws-amplify/graphql-relational-transformer';
import { AuthTransformer } from '@aws-amplify/graphql-auth-transformer';
import { TransformerPluginProvider } from '@aws-amplify/graphql-transformer-interfaces';
import { FunctionTransformer } from '@aws-amplify/graphql-function-transformer';
import { HttpTransformer } from '@aws-amplify/graphql-http-transformer';
import { PredictionsTransformer } from '@aws-amplify/graphql-predictions-transformer';
import { DefaultValueTransformer } from '@aws-amplify/graphql-default-value-transformer';

const BASE_ASSET_DIRECTORY = 'src/__tests__/assets/migration';
const V1_SCHEMA_DIRECTORY = 'v1-schemas';
const V2_SCHEMA_DIRECTORY = 'v2-schemas';

class MigrationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, MigrationError.prototype);
  }
}


function getV2DirectiveDefinitions(): string {
  const modelTransformer = new ModelTransformer();
  const indexTransformer = new IndexTransformer();
  const hasOneTransformer = new HasOneTransformer();
  const authTransformer = new AuthTransformer({
    adminRoles: [],
  });
  const transformerList: TransformerPluginProvider[] = [
    modelTransformer,
    new FunctionTransformer(),
    new HttpTransformer(),
    new PredictionsTransformer(),
    new PrimaryKeyTransformer(),
    indexTransformer,
    new BelongsToTransformer(),
    new HasManyTransformer(),
    hasOneTransformer,
    new ManyToManyTransformer(modelTransformer, indexTransformer, hasOneTransformer, authTransformer),
    new DefaultValueTransformer(),
    authTransformer,
  ];

  return transformerList
    .map(transformPluginInst => [transformPluginInst.directive, ...transformPluginInst.typeDefinitions].map(node => print(node)).join('\n'))
    .join('\n');
}


function migrateAndValidate(inputSchemaLocation: string, outputSchemaLocation: string, defaultAuth: string = 'apiKey'): void {
  const inputSchema = fs.readFileSync(inputSchemaLocation, 'utf-8');
  const migratedSchema = migrateGraphQLSchema(inputSchema, defaultAuth, parse(inputSchema));
  const validV2 = fs.readFileSync(outputSchemaLocation, 'utf-8');

  expect(migratedSchema).toMatch(validV2);
}

function getSchemaMigrationPairs(): Array<Array<string>> {
  const v1Path = path.resolve(path.join(BASE_ASSET_DIRECTORY, V1_SCHEMA_DIRECTORY));
  const v2Path = path.resolve(path.join(BASE_ASSET_DIRECTORY, V2_SCHEMA_DIRECTORY));
  const v1FileList = fs.readdirSync(v1Path);
  let fileListPairs = new Array<Array<string>>();
  v1FileList.forEach(file => {
    fileListPairs.push([
      path.join(v1Path, file),
      path.join(v2Path, file.replace(/v1\.graphql$/, "v2.graphql")),
    ]);
  });
  return fileListPairs;
}


describe('Bulk Migration Schema Tests', () => {
  test.each(getSchemaMigrationPairs())
  ('Validate that migrator creates expected output schema',(v1SchemaLocation: string, v2SchemaLocation: string) => {
    migrateAndValidate(v1SchemaLocation, v2SchemaLocation);
  });
});
