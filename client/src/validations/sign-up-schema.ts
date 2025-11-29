import { z } from 'zod';

import { validateCPF } from '@/utils/validate-cpf-field';

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

export type TSignUpFormSchema = z.infer<typeof signUpSchema>;
