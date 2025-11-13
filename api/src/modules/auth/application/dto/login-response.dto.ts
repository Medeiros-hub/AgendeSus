import { UserType } from '@prisma/client';

export class LoginResponseDto {
  user: {
    id: string;
    email: string;
    fullName: string;
    type: UserType;
  };
  expiresIn: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
