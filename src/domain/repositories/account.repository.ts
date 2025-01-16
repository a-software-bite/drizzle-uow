import { DrizzleTransaction } from '@/db';
import { ChangeBalanceBody } from '@/domain/dtos/account_dto';
import { GenericRepository } from '@/domain/repositories/generic.repository';
import { accounts } from '@/domain/schemas/accounts';
import { eq, sql } from 'drizzle-orm';

export class AccountRepository extends GenericRepository<typeof accounts> {
  constructor() {
    super(accounts);
  }

  async changeBalance(transaction: DrizzleTransaction, { accountId, amount }: ChangeBalanceBody): Promise<string> {
    const [updated] = await transaction
      .update(this.model)
      .set({ balance: sql<number>`${this.model.balance} + ${amount}` })
      .where(eq(this.model.id, accountId))
      .returning({ id: this.model.id });
    return updated.id;
  }
}
