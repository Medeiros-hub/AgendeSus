import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmSchedulingDto {
  @IsString()
  @IsNotEmpty({ message: 'Código de confirmação é obrigatório' })
  @Length(6, 6, { message: 'Código de confirmação deve ter 6 caracteres' })
  confirmCode: string;
}
