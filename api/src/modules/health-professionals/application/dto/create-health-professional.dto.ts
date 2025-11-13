import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateHealthProfessionalDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Especialidade é obrigatória' })
  specialty: string;

  @IsString()
  @IsNotEmpty({ message: 'CRM é obrigatório' })
  crm: string;

  @IsUUID('4', { message: 'ID da UBS inválido' })
  @IsNotEmpty({ message: 'ID da UBS é obrigatório' })
  ubsId: string;
}
