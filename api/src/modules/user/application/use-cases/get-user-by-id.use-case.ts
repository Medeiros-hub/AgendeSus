import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../shared/interfaces/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user.repository';

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserByIdResponse {
  user: User | null;
}

@Injectable()
export class GetUserByIdUseCase
  implements IUseCase<GetUserByIdRequest, GetUserByIdResponse>
{
  constructor(
    private readonly userRepository: PrismaUserRepository,
  ) {}

  async execute(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(request.id);

    return { user };
  }
}
