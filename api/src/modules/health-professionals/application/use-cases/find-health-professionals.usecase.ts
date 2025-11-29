import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IHealthProfessionalRepository,
  HEALTH_PROFESSIONAL_REPOSITORY,
} from '../../domain/repositories/health-professional.repository.interface';

@Injectable()
export class FindHealthProfessionalsUseCase
  implements
    IUseCase<
      { page?: number; limit?: number; serviceId?: string },
      { professionals: any[]; total: number }
    >
{
  constructor(
    @Inject(HEALTH_PROFESSIONAL_REPOSITORY)
    private readonly repo: IHealthProfessionalRepository,
  ) {}

  async execute(
    input: { page?: number; limit?: number; serviceId?: string } = {
      page: 1,
      limit: 10,
    },
  ) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const serviceId = input.serviceId;

    return this.repo.findAll(page, limit, serviceId);
  }
}
