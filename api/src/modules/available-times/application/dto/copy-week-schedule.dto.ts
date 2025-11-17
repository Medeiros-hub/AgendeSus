import { IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CopyWeekScheduleDto {
  @IsDateString({}, { message: 'Data de origem inválida' })
  sourceWeekStart: string; // Ex: "2025-11-11" (Segunda-feira)

  @IsDateString({}, { message: 'Data de destino inválida' })
  targetWeekStart: string; // Ex: "2025-11-18" (Segunda-feira)

  @IsUUID('4', { message: 'ID do profissional de saúde inválido' })
  @IsNotEmpty()
  healthProfessionalId: string;
}
