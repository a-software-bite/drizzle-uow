import { AccountNotFoundError, InsufficientBalanceError } from '@/domain/error_handling';
import { AccountRepository } from '@/domain/repositories/account.repository';
import { Account } from '@/domain/schemas/accounts';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AccountValidator {
  private db: NodePgDatabase;

  constructor(
    @inject('accountRepository') private accountRepository: AccountRepository,
    @inject('Db') private dbPool: NodePgDatabase,
  ) {
    this.db = this.dbPool;
  }

  async validateAccountExists(accountId: string): Promise<Account> {
    const existingAccount = await this.accountRepository.get(this.db, accountId);

    if (!existingAccount.length) {
      throw new AccountNotFoundError(`Account ${accountId} not found`);
    }
    return existingAccount[0];
  }

  async validateAccountBalance(accountId: string, requiredAmount: number): Promise<void> {
    const existingAccount = await this.validateAccountExists(accountId);
    const balance = existingAccount?.balance ?? 0;

    if (balance + requiredAmount < 0) {
      throw new InsufficientBalanceError(`Account ${accountId} has insufficient balance`);
    }
  }
}
