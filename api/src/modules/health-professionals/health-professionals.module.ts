import { Module } from '@nestjs/common';
import { HealthProfessionalsController } from './interface/http/health-professionals.controller';
import { HealthProfessionalsListController } from './interface/http/health-professionals.list.controller';
import { CreateHealthProfessionalUseCase } from './application/use-cases/create-health-professional.usecase';
import { FindHealthProfessionalsUseCase } from './application/use-cases/find-health-professionals.usecase';
import { DeleteHealthProfessionalUseCase } from './application/use-cases/delete-health-professional.usecase';
import { HealthProfessionalPrismaRepository } from './infra/repositories/health-professional-prisma.repository';
import { HEALTH_PROFESSIONAL_REPOSITORY } from './domain/repositories/health-professional.repository.interface';

@Module({
  controllers: [
    HealthProfessionalsController,
    HealthProfessionalsListController,
  ],
  providers: [
    CreateHealthProfessionalUseCase,
    FindHealthProfessionalsUseCase,
    DeleteHealthProfessionalUseCase,
    {
      provide: HEALTH_PROFESSIONAL_REPOSITORY,
      useClass: HealthProfessionalPrismaRepository,
    },
  ],
  exports: [
    HEALTH_PROFESSIONAL_REPOSITORY,
    FindHealthProfessionalsUseCase,
    DeleteHealthProfessionalUseCase,
  ],
})
export class HealthProfessionalsModule {}
