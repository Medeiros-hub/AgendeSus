import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { message: 'CPF inválido' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  fullName: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, {
    message: 'Telefone inválido',
  })
  phone: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;

  @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
  @IsOptional()
  type?: UserType = UserType.CITIZEN;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  zipcode: string;

  @IsString()
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  address: string;
}
