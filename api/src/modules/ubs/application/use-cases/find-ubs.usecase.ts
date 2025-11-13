import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IUBSRepository,
  UBS_REPOSITORY,
} from '../../domain/repositories/ubs.repository.interface';

@Injectable()
export class FindUBSUseCase
  implements
    IUseCase<
      { page?: number; limit?: number },
      { ubsList: any[]; total: number }
    >
{
  constructor(
    @Inject(UBS_REPOSITORY)
    private readonly ubsRepository: IUBSRepository,
  ) {}

  async execute(
    input: { page?: number; limit?: number } = { page: 1, limit: 10 },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    return this.ubsRepository.findAll(page, limit);
  }
}
