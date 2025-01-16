import { inject, injectable } from 'tsyringe';

import {
  AddAccountBody,
  AddAccountResponse,
  ChangeBalanceBody,
  ChangeBalanceResponse,
  GetAccountResponse,
} from '@/domain/dtos/account_dto';
import { AccountAlreadyExistsError, UnknownInternalError } from '@/domain/error_handling';
import { AccountRepository } from '@/domain/repositories/account.repository';
import { createRepositoryTransactionalOperation, InsertType } from '@/domain/repositories/generic.repository';
import { accounts } from '@/domain/schemas/accounts';
import { AccountValidator } from '@/domain/validators/account.validator';
import { UnitOfWork } from '@/unit_of_work';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseError } from 'pg';

@injectable()
export class AccountService {
  private db: NodePgDatabase;
  private unitOfWork: UnitOfWork;
  private accountValidator: AccountValidator;

  constructor(
    @inject('accountRepository') private accountRepository: AccountRepository,
    @inject('Db') private dbPool: NodePgDatabase,
  ) {
    this.db = this.dbPool;
    this.unitOfWork = new UnitOfWork(this.dbPool);
    this.accountValidator = new AccountValidator(this.accountRepository, this.dbPool);
  }

  async createAccount(account: AddAccountBody): Promise<AddAccountResponse> {
    const accountData: InsertType<typeof accounts> = {
      first_name: account.firstName,
      last_name: account.lastName,
      balance: 0,
    };

    this.unitOfWork.createTransaction([
      createRepositoryTransactionalOperation(
        this.accountRepository.add.bind(this.accountRepository),
        this.accountRepository,
        accountData,
      ),
    ]);

    try {
      const [createdId] = await this.unitOfWork.commit();
      return { accountId: createdId, name: `${account.firstName} ${account.lastName}` };
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new AccountAlreadyExistsError(
          `Account with details 'first name': '${account.firstName}', 'last name': '${account.lastName}' already exists`,
        );
      }
      // TODO: log specific error before bubbling up generic error
      throw new UnknownInternalError();
    }
  }

  async getAccount(accountId: string): Promise<GetAccountResponse | null> {
    const existingAccount = await this.accountRepository.get(this.db, accountId);

    if (!existingAccount.length) {
      return null;
    }

    const account = existingAccount[0];
    return { accountId: account.id!, name: `${account.first_name} ${account.last_name}`, balance: account.balance! };
  }

  async changeBalance(account: ChangeBalanceBody): Promise<ChangeBalanceResponse> {
    await this.accountValidator.validateAccountBalance(account.accountId, account.amount);

    this.unitOfWork.createTransaction([
      createRepositoryTransactionalOperation(
        this.accountRepository.changeBalance.bind(this.accountRepository),
        this.accountRepository,
        account,
      ),
    ]);

    await this.unitOfWork.commit();
    return { accountId: account.accountId, amount: account.amount };
  }
}
