import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../shared/interfaces/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';

export interface GetAllUsersRequest {
  page?: number;
  limit?: number;
}

export interface GetAllUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class GetAllUsersUseCase
  implements IUseCase<GetAllUsersRequest, GetAllUsersResponse>
{
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute(request: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;

    const users = await this.userRepository.findAll();
    const total = users.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      total,
      page,
      limit,
    };
  }
}
