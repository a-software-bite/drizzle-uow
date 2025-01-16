import { baseSchema } from '@/domain/schemas/base';
import { integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core';

export const accounts = pgTable(
  'accounts',
  {
    ...baseSchema,
    first_name: varchar('first_name', { length: 256 }),
    last_name: varchar('last_name', { length: 256 }),
    balance: integer('balance'),
  },
  (t) => ({
    unq: unique().on(t.first_name, t.last_name),
  }),
);

export type Account = typeof accounts.$inferInsert;
