import { z } from 'zod';

import { EUserType } from '@/services/internal-api/types/auth';

export const createUserSchema = z
  .object({
    cpf: z
      .string()
      .min(11, 'CPF deve ter 11 dígitos')
      .max(14, 'CPF inválido')
      .regex(/^[0-9.-]+$/, 'CPF inválido'),
    fullName: z
      .string()
      .min(3, 'Nome deve ter ao menos 3 caracteres')
      .max(120, 'Nome muito longo'),
    birthDate: z.string().nonempty('Data de nascimento obrigatória'),
    phone: z
      .string()
      .min(8, 'Telefone inválido')
      .max(20, 'Telefone inválido')
      .regex(/^[0-9()\-\s+]+$/, 'Telefone inválido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string(),
    type: z.nativeEnum(EUserType),
    zipcode: z
      .string()
      .min(8, 'CEP inválido')
      .max(9, 'CEP inválido')
      .regex(/^[0-9-]+$/, 'CEP inválido'),
    address: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter ao menos 3 caracteres')
    .max(120, 'Nome muito longo'),
  birthDate: z.string().nonempty('Data de nascimento obrigatória'),
  phone: z
    .string()
    .min(8, 'Telefone inválido')
    .max(20, 'Telefone inválido')
    .regex(/^[0-9()\-\s+]+$/, 'Telefone inválido'),
  zipcode: z
    .string()
    .min(8, 'CEP inválido')
    .max(9, 'CEP inválido')
    .regex(/^[0-9-]+$/, 'CEP inválido'),
  address: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres'),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
