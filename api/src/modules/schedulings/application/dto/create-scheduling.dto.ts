import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSchedulingDto {
  @IsUUID('4', { message: 'ID do horário disponível inválido' })
  @IsNotEmpty({ message: 'ID do horário disponível é obrigatório' })
  availableTimeId: string;
}
