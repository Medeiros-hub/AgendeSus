import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class GenerateSlotsDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  @IsNotEmpty()
  date: string;

  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora inicial deve estar no formato HH:mm',
  })
  @IsNotEmpty()
  startHour: string;

  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora final deve estar no formato HH:mm',
  })
  @IsNotEmpty()
  endHour: string;

  @IsInt()
  @Min(15, { message: 'Intervalo mínimo é de 15 minutos' })
  @Max(120, { message: 'Intervalo máximo é de 120 minutos' })
  intervalMinutes: number;

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
