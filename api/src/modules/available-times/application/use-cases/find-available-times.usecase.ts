import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../domain/repositories/available-time.repository.interface';

@Injectable()
export class FindAvailableTimesUseCase
  implements
    IUseCase<
      { page?: number; limit?: number; filters?: any },
      { times: any[]; total: number }
    >
{
  constructor(
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly repo: IAvailableTimeRepository,
  ) {}

  async execute(
    input: { page?: number; limit?: number; filters?: any } = {
      page: 1,
      limit: 10,
    },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    return this.repo.findAvailable(input.filters ?? {}, page, limit);
  }
}
