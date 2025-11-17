import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsArray,
  IsEnum,
  IsDateString,
  ValidateNested,
  IsOptional,
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

enum ConflictBehavior {
  SKIP = 'skip', // Pular horários conflitantes (padrão)
  FAIL = 'fail', // Cancelar toda operação se houver conflito
  REPLACE = 'replace', // Substituir horários conflitantes
}

class TimeSlotDto {
  @IsString({ message: 'Horário de início inválido' })
  @IsNotEmpty()
  startTime: string; // Ex: "08:00"

  @IsString({ message: 'Horário de fim inválido' })
  @IsNotEmpty()
  endTime: string; // Ex: "09:00"
}

export class CreateRecurringAvailableTimesDto {
  @IsDateString({}, { message: 'Data de início inválida' })
  startDate: string; // Ex: "2025-11-20" - A partir de quando começar

  @IsDateString({}, { message: 'Data de fim inválida' })
  endDate: string; // Ex: "2026-02-20" - Até quando criar

  @IsArray({ message: 'Informe os dias da semana' })
  @IsEnum(DayOfWeek, { each: true, message: 'Dia da semana inválido' })
  daysOfWeek: DayOfWeek[]; // Ex: [1, 3, 5] = Segunda, Quarta, Sexta

  @IsArray({ message: 'Informe os horários' })
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[]; // Ex: [{ startTime: "08:00", endTime: "12:00" }]

  @IsUUID('4', { message: 'ID do profissional de saúde inválido' })
  @IsNotEmpty()
  healthProfessionalId: string;

  @IsUUID('4', { message: 'ID da UBS inválido' })
  @IsNotEmpty()
  ubsId: string;

  @IsUUID('4', { message: 'ID do serviço inválido' })
  @IsNotEmpty()
  serviceId: string;

  @IsString({ message: 'Duração da consulta inválida' })
  @IsNotEmpty()
  slotDuration: string; // Ex: "30"

  @IsEnum(ConflictBehavior, { message: 'Comportamento de conflito inválido' })
  @IsOptional()
  conflictBehavior?: ConflictBehavior; // Padrão: 'skip'
}

export { DayOfWeek, ConflictBehavior };
