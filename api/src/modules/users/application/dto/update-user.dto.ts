import { IsString, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  fullName?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, {
    message: 'Telefone inválido',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  zipcode?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
