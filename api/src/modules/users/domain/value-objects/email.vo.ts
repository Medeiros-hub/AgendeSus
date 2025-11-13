import { InvalidArgumentException } from '@/@core/domain/domain.exception';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!this.isValid(normalized)) {
      throw new InvalidArgumentException('Email inválido');
    }

    this.value = normalized;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(email: Email): boolean {
    return this.value === email.value;
  }
}
