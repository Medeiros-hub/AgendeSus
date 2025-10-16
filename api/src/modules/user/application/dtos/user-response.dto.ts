import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'CPF do usuário',
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  fullName: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1990-01-01T00:00:00.000Z',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '11999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Tipo do usuário',
    enum: UserType,
    example: UserType.CITIZEN,
  })
  type: UserType;

  @ApiProperty({
    description: 'CEP do usuário',
    example: '12345678',
    required: false,
  })
  zipcode?: string;

  @ApiProperty({
    description: 'Endereço completo do usuário',
    example: 'Rua das Flores, 123, Centro',
    required: false,
  })
  address?: string;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
