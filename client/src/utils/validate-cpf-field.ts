export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (base: string, factor: number) =>
    base
      .split('')
      .reduce((acc, num, idx) => acc + Number(num) * (factor - idx), 0);

  const digit1 = ((calc(cpf.slice(0, 9), 10) * 10) % 11) % 10;
  const digit2 = ((calc(cpf.slice(0, 10), 11) * 10) % 11) % 10;

  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
}
