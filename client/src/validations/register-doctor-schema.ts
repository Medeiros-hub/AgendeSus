import { z } from 'zod';

export const registerDoctorSchema = z
  .object({
    fullName: z
      .string()
      .min(3, 'O nome completo deve ter ao menos 3 caracteres')
      .max(120, 'O nome completo é muito longo'),
    crm: z
      .string()
      .min(3, 'O CRM deve ter ao menos 3 caracteres')
      .max(20, 'O CRM é muito longo'),
    specialty: z.string().nonempty('Selecione uma especialidade'),
    phone: z
      .string()
      .min(8, 'Telefone inválido')
      .max(20, 'Telefone inválido')
      .regex(/^[0-9()\-\s+]+$/, 'Telefone inválido'),
    email: z.string().email('E-mail inválido'),
    startTime: z.string().nonempty('Horário de início obrigatório'),
    endTime: z.string().nonempty('Horário de fim obrigatório'),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.endTime > data.startTime;
    },
    {
      message: 'O horário de fim deve ser posterior ao horário de início',
      path: ['endTime'],
    },
  );

export type RegisterDoctorSchema = z.infer<typeof registerDoctorSchema>;
