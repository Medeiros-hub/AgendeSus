import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João da Silva Santos',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255, { message: 'Nome deve ter entre 3 e 255 caracteres' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Telefone do usuário',
    example: '11888888888',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'novo@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'CEP do usuário',
    example: '87654321',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve ter exatamente 8 dígitos' })
  zipcode?: string;

  @ApiPropertyOptional({
    description: 'Endereço completo do usuário',
    example: 'Rua das Palmeiras, 456, Vila Nova',
  })
  @IsOptional()
  @IsString()
  @Length(5, 500, { message: 'Endereço deve ter entre 5 e 500 caracteres' })
  address?: string;
}
