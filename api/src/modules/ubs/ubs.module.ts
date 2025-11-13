import { Module } from '@nestjs/common';
import { UBSController } from './interface/http/ubs.controller';
import { UBSListController } from './interface/http/ubs.list.controller';
import { CreateUBSUseCase } from './application/use-cases/create-ubs.usecase';
import { FindUBSUseCase } from './application/use-cases/find-ubs.usecase';
import { DeleteUBSUseCase } from './application/use-cases/delete-ubs.usecase';
import { UBSPrismaRepository } from './infra/repositories/ubs-prisma.repository';
import { UBS_REPOSITORY } from './domain/repositories/ubs.repository.interface';

@Module({
  controllers: [UBSController, UBSListController],
  providers: [
    CreateUBSUseCase,
    FindUBSUseCase,
    DeleteUBSUseCase,
    {
      provide: UBS_REPOSITORY,
      useClass: UBSPrismaRepository,
    },
  ],
  exports: [UBS_REPOSITORY, FindUBSUseCase, DeleteUBSUseCase],
})
export class UBSModule {}
