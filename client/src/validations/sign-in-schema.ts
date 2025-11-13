import { z } from 'zod';

export const signInUserSchema = z
  .object({
    identifier: z.string().min(1, 'E-mail ou CPF é obrigatório'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  })
  .refine(
    (data) => /@/.test(data.identifier) || /^\d{11}/.test(data.identifier),
    {
      error: 'Seu usuário deve ser um email ou CPF válido',
    },
  );

export type TSignInUserSchema = z.infer<typeof signInUserSchema>;
