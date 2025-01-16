import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { Client, ClientConfig, Pool, PoolConfig } from 'pg';

import { dbClientConfig } from '@/config';
import * as accountsSchema from '@/domain/schemas/accounts';
import * as toysSchema from '@/domain/schemas/toys';

const clientConfig: ClientConfig = {
  host: dbClientConfig.host,
  user: dbClientConfig.user,
  password: dbClientConfig.password,
  database: dbClientConfig.database,
  port: dbClientConfig.port,
};

const poolConfig: PoolConfig = {
  ...clientConfig,
  max: 20,
};

const schema = {
  ...toysSchema,
  ...accountsSchema,
};

// Client and drizzle database for migrations
export const pgClient = new Client(clientConfig);
export const db = drizzle(pgClient, {
  schema: schema,
});

// Pool and drizzle database for the application
const pgPool = new Pool(poolConfig);
export const dbPool = drizzle(pgPool, { logger: true });

export type DrizzlePool = ReturnType<typeof drizzle>;

// Drizzle transaction for transactional operations
export type DrizzleTransaction = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, unknown>,
  ExtractTablesWithRelations<Record<string, unknown>>
>;
