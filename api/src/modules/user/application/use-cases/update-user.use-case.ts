import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../shared/interfaces/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';
import * as bcrypt from 'bcryptjs';

export interface UpdateUserRequest extends UpdateUserDto {
  id: string;
}

export interface UpdateUserResponse {
  user: User;
}

@Injectable()
export class UpdateUserUseCase
  implements IUseCase<UpdateUserRequest, UpdateUserResponse>
{
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { id, ...updateData } = request;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    if (request.email && request.email !== existingUser.email) {
      const existingUserByEmail = await this.userRepository.existsByEmail(
        request.email,
      );
      if (existingUserByEmail) {
        throw new Error('Email já está em uso');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return { user: updatedUser };
  }
}
