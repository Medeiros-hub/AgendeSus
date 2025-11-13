import { Module } from '@nestjs/common';
import { ServicesController } from './interface/http/services.controller';
import { ServicesListController } from './interface/http/services.list.controller';
import { CreateServiceUseCase } from './application/use-cases/create-service.usecase';
import { FindServicesUseCase } from './application/use-cases/find-services.usecase';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.usecase';
import { ServicePrismaRepository } from './infra/repositories/service-prisma.repository';
import { SERVICE_REPOSITORY } from './domain/repositories/service.repository.interface';

@Module({
  controllers: [ServicesController, ServicesListController],
  providers: [
    CreateServiceUseCase,
    FindServicesUseCase,
    DeleteServiceUseCase,
    {
      provide: SERVICE_REPOSITORY,
      useClass: ServicePrismaRepository,
    },
  ],
  exports: [SERVICE_REPOSITORY, FindServicesUseCase, DeleteServiceUseCase],
})
export class ServicesModule {}
