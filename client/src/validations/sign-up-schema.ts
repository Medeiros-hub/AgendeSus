import { email, refine, z } from 'zod';

const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calc = (base: string, factor: number) =>
    base
      .split('')
      .reduce((acc, num, idx) => acc + Number(num) * (factor - idx), 0);

  const digit1 = ((calc(cpf.slice(0, 9), 10) * 10) % 11) % 10;
  const digit2 = ((calc(cpf.slice(0, 10), 11) * 10) % 11) % 10;

  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
};

export const signUpSchema = z.object({
  cpf: z
    .string()
    .nonempty('CPF é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(validateCPF, { message: 'CPF inválido' }),

  fullName: z
    .string()
    .nonempty('Nome completo é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  birthDate: z.iso.date({ error: 'Data de nascimento inválida' }),

  phone: z
    .string()
    .nonempty('Telefone é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: 'Telefone deve ter 10 ou 11 dígitos',
    }),

  email: z.email('Formato de e-mail inválido').nonempty('E-mail é obrigatório'),

  password: z
    .string()
    .nonempty('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  zipcode: z
    .string()
    .nonempty('CEP é obrigatório')
    .regex(/^\d{5}-?\d{3}$/, {
      message: 'CEP inválido',
    }),

  address: z
    .string()
    .nonempty('Endereço é obrigatório')
    .min(5, 'Endereço deve ter pelo menos 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
