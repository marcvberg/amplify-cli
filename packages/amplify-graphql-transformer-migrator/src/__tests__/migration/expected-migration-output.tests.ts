import { parse } from 'graphql';
import { migrateGraphQLSchema } from '../../schema-migrator';
import * as fs from 'fs-extra';
import * as path from 'path';

const BASE_ASSET_DIRECTORY = '../assets/migration';
const V1_SCHEMA_DIRECTORY = 'v1-schemas';
const V2_SCHEMA_DIRECTORY = 'v2-schemas';

function migrateAndValidate(inputSchemaLocation: string, outputSchemaLocation: string, defaultAuth: string = 'apiKey'): void {
  const docNode = parse(inputSchemaLocation);
  const migratedSchema = migrateGraphQLSchema(outputSchemaLocation, defaultAuth, docNode);

  parse(migratedSchema);
  expect(migratedSchema).toMatchSnapshot();
}

function getSchemaMigrationPairs(): TemplateStringsArray {
  const v1FileList = fs.readdirSync(path.join(BASE_ASSET_DIRECTORY, V1_SCHEMA_DIRECTORY));
  let fileListPairs = new Array<Array<string>>();
  v1FileList.forEach(file => {
    fileListPairs.push([
      file,
      file.replace(/v1\.graphql$/, "v2.graphql"),
    ]);
  });
  return fileListPairs as unknown as TemplateStringsArray;
}


describe('Bulk Migration Schema Tests', () => {
  test.each(getSchemaMigrationPairs(), (v1SchemaLocation: string, v2SchemaLocation: string) => {

  });
});
