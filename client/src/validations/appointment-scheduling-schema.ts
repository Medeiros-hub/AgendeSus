import z from 'zod';

import { validateCPF } from '@/utils/validate-cpf-field';

export const appointmentSchedulingSchema = z.object({
  fullName: z
    .string()
    .min(3, 'O nome completo deve ter pelo menos 3 caracteres'),

  phone: z
    .string()
    .min(10, 'O telefone deve ter pelo menos 10 dígitos')
    .max(15, 'O telefone deve ter no máximo 15 dígitos'),

  cpf: z
    .string()
    .nonempty('CPF é obrigatório')
    .transform((val) => val.replace(/\D/g, ''))
    .refine(validateCPF, { message: 'CPF inválido' }),

  service: z.string('Selecione um serviço').nonempty('Selecione um serviço'),

  professional: z
    .string('Selecione um profissional')
    .nonempty('Selecione um profissional'),

  date: z
    .string()
    .nonempty('Selecione uma data')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),

  time: z.string('Selecione um horário').nonempty('Selecione um horário'),
});

export type TAppointmentSchedulingSchema = z.infer<
  typeof appointmentSchedulingSchema
>;
