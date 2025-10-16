import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'CPF do usuário',
    example: '12345678901',
  })
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsString()
  @Length(3, 255, { message: 'Nome deve ter entre 3 e 255 caracteres' })
  fullName: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1990-01-01',
  })
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '11999999999',
  })
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsOptional()
  @IsString()
  @Length(6, 100, { message: 'Senha deve ter entre 6 e 100 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Tipo do usuário',
    enum: UserType,
    example: UserType.CITIZEN,
  })
  @IsOptional()
  @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
  type?: UserType;

  @ApiPropertyOptional({
    description: 'CEP do usuário',
    example: '12345678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve ter exatamente 8 dígitos' })
  zipcode?: string;

  @ApiPropertyOptional({
    description: 'Endereço completo do usuário',
    example: 'Rua das Flores, 123, Centro',
  })
  @IsOptional()
  @IsString()
  @Length(5, 500, { message: 'Endereço deve ter entre 5 e 500 caracteres' })
  address?: string;
}
