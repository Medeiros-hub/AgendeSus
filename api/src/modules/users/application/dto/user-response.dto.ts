import { UserType } from '@prisma/client';

export class UserResponseDto {
  id: string;
  cpf: string;
  fullName: string;
  birthDate: Date;
  phone: string;
  email: string;
  type: UserType;
  zipcode: string;
  address: string;
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
