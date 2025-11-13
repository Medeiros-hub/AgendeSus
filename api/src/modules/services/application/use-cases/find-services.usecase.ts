import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IServiceRepository,
  SERVICE_REPOSITORY,
} from '../../domain/repositories/service.repository.interface';

@Injectable()
export class FindServicesUseCase
  implements
    IUseCase<
      { page?: number; limit?: number },
      { services: any[]; total: number }
    >
{
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async execute(
    input: { page?: number; limit?: number } = { page: 1, limit: 10 },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    return this.serviceRepository.findAll(page, limit);
  }
}
