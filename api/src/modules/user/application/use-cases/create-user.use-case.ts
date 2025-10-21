import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../shared/interfaces/use-case.interface';
import { User, UserType } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import * as bcrypt from 'bcryptjs';

export interface CreateUserRequest extends CreateUserDto {}

export interface CreateUserResponse {
  user: User;
}

@Injectable()
export class CreateUserUseCase
  implements IUseCase<CreateUserRequest, CreateUserResponse>
{
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUserByCpf = await this.userRepository.existsByCpf(
      request.cpf,
    );
    if (existingUserByCpf) {
      throw new Error('CPF já está em uso');
    }

    if (request.email) {
      const existingUserByEmail = await this.userRepository.existsByEmail(
        request.email,
      );
      if (existingUserByEmail) {
        throw new Error('Email já está em uso');
      }
    }

    const userData = {
      cpf: request.cpf,
      fullName: request.fullName,
      birthDate: new Date(request.birthDate),
      phone: request.phone,
      email: request.email,
      type: request.type || UserType.CITIZEN,
      zipcode: request.zipcode,
      address: request.address,
    };

    const user = new User(userData);

    if (!user.isValidCpf()) {
      throw new Error('CPF inválido');
    }

    if (request.password) {
      const hashedPassword = await bcrypt.hash(request.password, 12);
      user.setPassword(hashedPassword);
    }

    const createdUser = await this.userRepository.create(user);

    return { user: createdUser };
  }
}
