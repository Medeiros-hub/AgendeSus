export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_ARGUMENT');
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} com ID ${id} não encontrado`, 'ENTITY_NOT_FOUND');
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
  }
}
