import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateAvailableTimeDto {
  @IsDateString({}, { message: 'Data inválida' })
  date: string;

  @IsDateString({}, { message: 'Horário de início inválido' })
  startTime: string;

  @IsDateString({}, { message: 'Horário de fim inválido' })
  endTime: string;

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
