import { GenericRepository } from '@/domain/repositories/generic.repository';
import { toys } from '@/domain/schemas/toys';

export class ToyRepository extends GenericRepository<typeof toys> {
  constructor() {
    super(toys);
  }
}
