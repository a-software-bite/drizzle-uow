import { baseSchema } from '@/domain/schemas/base';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const toys = pgTable('toys', {
  ...baseSchema,
  name: varchar('name', { length: 256 }).unique(),
  price: integer('price'),
});

export type Toy = typeof toys.$inferInsert;
