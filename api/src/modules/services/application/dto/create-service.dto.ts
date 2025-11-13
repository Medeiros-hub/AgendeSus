import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt({ message: 'Duração deve ser um número inteiro' })
  @Min(1, { message: 'Duração deve ser pelo menos 1 minuto' })
  @IsOptional()
  durationMinutes?: number = 30;
}
