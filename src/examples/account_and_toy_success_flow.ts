// This import must go first so that the container is initialized
import 'reflect-metadata';

import { dbPool } from '@/db';
import { AccountRepository } from '@/domain/repositories/account.repository';
import { ToyRepository } from '@/domain/repositories/toy.repository';
import { AccountService } from '@/domain/services/account.service';
import { ToyService } from '@/domain/services/toy.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { container } from 'tsyringe';

async function accountAndToySuccessFlow() {
  container.register<NodePgDatabase>('Db', { useValue: dbPool });
  container.register<AccountRepository>('accountRepository', { useValue: new AccountRepository() });
  container.register<ToyRepository>('toyRepository', { useValue: new ToyRepository() });

  const accountService = container.resolve(AccountService);
  const toyService = container.resolve(ToyService);

  // 1. Create a new account
  const newAccount = await accountService.createAccount({
    firstName: 'John',
    lastName: 'Doe',
  });
  console.log('Account created:', newAccount);

  // 2. Add balance to account (100)
  const updatedBalance = await accountService.changeBalance({
    accountId: newAccount.accountId,
    amount: 100,
  });
  console.log('Balance updated:', updatedBalance);

  // 3. Buy a toy using the account
  const newToy = await toyService.buyToy({
    name: 'LEGO Star Wars',
    price: 50,
    accountId: newAccount.accountId,
  });
  console.log('Toy purchased:', newToy);

  // 4. Verify final state (balance should be 50)
  const finalAccount = await accountService.getAccount(newAccount.accountId);

  if (!finalAccount) {
    throw new Error('Account not found');
  }
  console.log('Final account balance:', finalAccount.balance);
}

accountAndToySuccessFlow()
  .catch(console.error)
  .finally(() => process.exit(0));
