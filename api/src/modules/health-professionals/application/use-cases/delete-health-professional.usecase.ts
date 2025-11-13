import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IHealthProfessionalRepository,
  HEALTH_PROFESSIONAL_REPOSITORY,
} from '../../domain/repositories/health-professional.repository.interface';

@Injectable()
export class DeleteHealthProfessionalUseCase implements IUseCase<string, void> {
  constructor(
    @Inject(HEALTH_PROFESSIONAL_REPOSITORY)
    private readonly repo: IHealthProfessionalRepository,
  ) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
