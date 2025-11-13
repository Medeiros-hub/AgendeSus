import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { HealthProfessional } from '../../domain/entities/health-professional.entity';
import {
  IHealthProfessionalRepository,
  HEALTH_PROFESSIONAL_REPOSITORY,
} from '../../domain/repositories/health-professional.repository.interface';
import { CreateHealthProfessionalDto } from '../dto/create-health-professional.dto';

@Injectable()
export class CreateHealthProfessionalUseCase
  implements IUseCase<CreateHealthProfessionalDto, HealthProfessional>
{
  constructor(
    @Inject(HEALTH_PROFESSIONAL_REPOSITORY)
    private readonly repository: IHealthProfessionalRepository,
  ) {}

  async execute(
    input: CreateHealthProfessionalDto,
  ): Promise<HealthProfessional> {
    const professional = new HealthProfessional({
      id: uuid(),
      name: input.name,
      specialty: input.specialty,
      crm: input.crm,
      ubsId: input.ubsId,
      createdAt: new Date(),
    });

    return this.repository.create(professional);
  }
}
