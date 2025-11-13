import { InvalidArgumentException } from '@/@core/domain/domain.exception';

export class CPF {
  private readonly value: string;

  constructor(cpf: string) {
    const cleaned = this.clean(cpf);

    if (!this.isValid(cleaned)) {
      throw new InvalidArgumentException('CPF inválido');
    }

    this.value = cleaned;
  }

  private clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private isValid(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  equals(cpf: CPF): boolean {
    return this.value === cpf.value;
  }
}
