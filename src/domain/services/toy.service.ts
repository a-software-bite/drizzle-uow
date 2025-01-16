import { inject, injectable } from 'tsyringe';

import { AddToyBody, AddToyResponse, GetToyResponse } from '@/domain/dtos/toy_dto';
import { ToyAlreadyExistsError, UnknownInternalError } from '@/domain/error_handling';
import { AccountRepository } from '@/domain/repositories/account.repository';
import { createRepositoryTransactionalOperation } from '@/domain/repositories/generic.repository';
import { ToyRepository } from '@/domain/repositories/toy.repository';
import { AccountValidator } from '@/domain/validators/account.validator';
import { UnitOfWork } from '@/unit_of_work';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseError } from 'pg';

@injectable()
export class ToyService {
  private db: NodePgDatabase;
  private unitOfWork: UnitOfWork;
  private accountValidator: AccountValidator;

  constructor(
    @inject('toyRepository') private toyRepository: ToyRepository,
    @inject('accountRepository') private accountRepository: AccountRepository,
    @inject('Db') private dbPool: NodePgDatabase,
  ) {
    this.db = this.dbPool;
    this.unitOfWork = new UnitOfWork(this.dbPool);
    this.accountValidator = new AccountValidator(this.accountRepository, this.dbPool);
  }

  async getToy(toyId: string): Promise<GetToyResponse | null> {
    const existingToy = await this.toyRepository.get(this.db, toyId);

    if (!existingToy.length) {
      return null;
    }

    const toy = existingToy[0];
    return { toyId: toy.id!, name: toy.name!, price: toy.price! };
  }

  async buyToy(toy: AddToyBody): Promise<AddToyResponse> {
    await this.accountValidator.validateAccountBalance(toy.accountId, -toy.price);

    this.unitOfWork.createTransaction([
      createRepositoryTransactionalOperation(this.toyRepository.add.bind(this.toyRepository), this.toyRepository, toy),
      createRepositoryTransactionalOperation(
        this.accountRepository.changeBalance.bind(this.accountRepository),
        this.accountRepository,
        {
          accountId: toy.accountId,
          amount: -toy.price,
        },
      ),
    ]);

    // Potential errors are:
    // existing toy
    // insufficient balance
    // unknown internal error
    try {
      const [createdId] = await this.unitOfWork.commit();
      return { toyId: createdId, name: `${toy.name}` };
    } catch (error) {
      if (error instanceof DatabaseError && error.code === '23505') {
        throw new ToyAlreadyExistsError(`Toy with details 'name': '${toy.name}' already exists`);
      }
      // TODO: log specific error before bubbling up generic error
      throw new UnknownInternalError();
    }
  }
}
