import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

interface FindUsersInput {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

@Injectable()
export class FindUsersUseCase
  implements IUseCase<FindUsersInput, { users: any[]; total: number }>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: FindUsersInput = { page: 1, limit: 10 }) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const search = input.search;
    const type = input.type;

    return this.userRepository.findAll(page, limit, search, type);
  }
}
