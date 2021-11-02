import { parse } from 'graphql';
import { migrateGraphQLSchema } from '../../schema-migrator';

function migrateAndValidate(inputSchema: string, outputSchema: string, defaultAuth: string = 'apiKey'): void {
  const docNode = parse(inputSchema);
  const migratedSchema = migrateGraphQLSchema(inputSchema, defaultAuth, docNode);

  parse(migratedSchema);
  expect(migratedSchema).toMatchSnapshot();
}
