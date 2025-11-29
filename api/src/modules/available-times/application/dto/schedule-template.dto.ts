import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

class WeeklyScheduleTemplateItem {
  @IsEnum(DayOfWeek, { message: 'Dia da semana inválido' })
  dayOfWeek: DayOfWeek;

  @IsString()
  @IsNotEmpty()
  startTime: string; // Ex: "08:00"

  @IsString()
  @IsNotEmpty()
  endTime: string; // Ex: "12:00"

  @IsString()
  @IsNotEmpty()
  slotDuration: string; // Ex: "30" minutos
}

export class CreateScheduleTemplateDto {
  @IsString({ message: 'Nome do template é obrigatório' })
  @IsNotEmpty()
  name: string; // Ex: "Horário Padrão Dr. João"

  @IsString()
  @IsOptional()
  description?: string; // Ex: "Segunda a Sexta, manhã e tarde"

  @IsArray({ message: 'Informe os horários semanais' })
  @ValidateNested({ each: true })
  @Type(() => WeeklyScheduleTemplateItem)
  weeklySchedule: WeeklyScheduleTemplateItem[];

  @IsUUID('4', { message: 'ID do profissional de saúde inválido' })
  @IsNotEmpty()
  healthProfessionalId: string;

  @IsUUID('4', { message: 'ID da UBS inválido' })
  @IsNotEmpty()
  ubsId: string;

  @IsUUID('4', { message: 'ID do serviço inválido' })
  @IsNotEmpty()
  serviceId: string;
}

export class ApplyScheduleTemplateDto {
  @IsUUID('4', { message: 'ID do template inválido' })
  @IsNotEmpty()
  templateId: string;

  @IsDateString({}, { message: 'Data de início inválida' })
  startDate: string; // Ex: "2025-11-20"

  @IsDateString({}, { message: 'Data de fim inválida' })
  endDate: string; // Ex: "2026-02-20"
}
