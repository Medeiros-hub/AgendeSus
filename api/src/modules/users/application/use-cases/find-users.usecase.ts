import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class FindUsersUseCase
  implements
    IUseCase<{ page?: number; limit?: number }, { users: any[]; total: number }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: { page?: number; limit?: number } = { page: 1, limit: 10 },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    return this.userRepository.findAll(page, limit);
  }
}
