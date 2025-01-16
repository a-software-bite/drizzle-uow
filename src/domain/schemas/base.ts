import { PgColumn, uuid } from 'drizzle-orm/pg-core';

export const baseSchema = {
  id: uuid('id').defaultRandom().primaryKey(),
} as const;

export type IdColumn = PgColumn<{
  name: 'id';
  tableName: string;
  dataType: 'string';
  columnType: 'PgUUID';
  data: string;
  driverParam: string;
  hasDefault: true;
  notNull: true;
  isPrimaryKey: true;
  isAutoincrement: false;
  hasRuntimeDefault: false;
  enumValues: undefined;
  generated: undefined;
}>;

export interface ITableWithId {
  id: IdColumn;
}
