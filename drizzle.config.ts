import { Config, defineConfig } from 'drizzle-kit';
import { resolve } from 'path';
import { dbClientConfig } from './src/config';
import { getSchemaFilesInFolder } from './src/utils/db/schema_files';

const schemaPath = resolve(process.cwd(), 'src/domain/schemas');

const schemaFiles = getSchemaFilesInFolder(schemaPath);

const config: Config = {
  schema: schemaFiles,
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbClientConfig.host,
    user: dbClientConfig.user,
    password: dbClientConfig.password,
    database: dbClientConfig.database,
    port: dbClientConfig.port,
  },
};

export default defineConfig(config);
