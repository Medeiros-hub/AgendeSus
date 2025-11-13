import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUBSDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido' })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  phone: string;
}
