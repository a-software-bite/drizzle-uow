import { DrizzleTransaction } from '@/db';
import { ITableWithId } from '@/domain/schemas/base';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PgTable } from 'drizzle-orm/pg-core';

export type TableWithId = PgTable & ITableWithId;
export type InsertType<TSchema extends TableWithId> = TSchema['$inferInsert'];

export interface IGenericRepository<TSchema extends TableWithId> {
  add(transaction: DrizzleTransaction, data: InsertType<TSchema>): Promise<string>;
}

export class GenericRepository<TSchema extends TableWithId> implements IGenericRepository<TSchema> {
  constructor(readonly model: TSchema) {}

  async add(transaction: DrizzleTransaction, data: InsertType<TSchema>): Promise<string> {
    const [inserted] = await transaction.insert(this.model).values(data).returning({ id: this.model.id });
    return inserted.id;
  }

  async get(db: NodePgDatabase, id: string): Promise<InsertType<TSchema>[]> {
    return await db.select().from(this.model).where(eq(this.model.id, id));
  }
}

export type RepositoryTransactionalOperation<TSchema extends TableWithId, TData = InsertType<TSchema>> = (
  this: GenericRepository<TSchema>,
  transaction: DrizzleTransaction,
  data: TData,
) => Promise<string>;

export function createRepositoryTransactionalOperation<TSchema extends TableWithId, TData = InsertType<TSchema>>(
  operation: RepositoryTransactionalOperation<TSchema, TData>,
  context: GenericRepository<TSchema>,
  data: TData,
): (transactionScope: DrizzleTransaction) => Promise<string> {
  return async (transactionScope) => {
    return operation.call(context, transactionScope, data);
  };
}
