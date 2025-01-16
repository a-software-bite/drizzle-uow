import { DrizzlePool, DrizzleTransaction } from '@/db';

export class UnitOfWork {
  private _databaseConnection: DrizzlePool;
  private _operations: Array<(transactionScope: DrizzleTransaction) => Promise<string>> = [];

  constructor(databaseConnection: DrizzlePool) {
    this._databaseConnection = databaseConnection;
  }

  public createTransaction(operations: Array<(transactionScope: DrizzleTransaction) => Promise<string>>): void {
    this._operations = operations;
  }

  async commit(): Promise<string[]> {
    const results: string[] = [];
    await this._databaseConnection.transaction(async (transaction) => {
      for (const operation of this._operations) {
        const result = await operation(transaction);
        results.push(result);
      }
    });
    return results;
  }
}
