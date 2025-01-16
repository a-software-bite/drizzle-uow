export class UnknownInternalError extends Error {
  constructor() {
    super('Internal server error');
    this.name = 'UnknownInternalError';
  }
}

export abstract class DomainError extends Error {}

export class InsufficientBalanceError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientBalanceError';
  }
}

export class InvalidUUIDError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUUIDError';
  }
}

export class AccountNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'AccountNotFoundError';
  }
}

export class AccountAlreadyExistsError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'AccountAlreadyExistsError';
  }
}

export class ToyNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ToyNotFoundError';
  }
}

export class ToyAlreadyExistsError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ToyAlreadyExistsError';
  }
}
