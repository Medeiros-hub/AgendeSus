import { Module } from '@nestjs/common';
import { SchedulingsController } from './interface/http/schedulings.controller';
import { SchedulingsListController } from './interface/http/schedulings.list.controller';
import { CreateSchedulingUseCase } from './application/use-cases/create-scheduling.usecase';
import { ConfirmSchedulingUseCase } from './application/use-cases/confirm-scheduling.usecase';
import { CancelSchedulingUseCase } from './application/use-cases/cancel-scheduling.usecase';
import { FindSchedulingsUseCase } from './application/use-cases/find-schedulings.usecase';
import { DeleteSchedulingUseCase } from './application/use-cases/delete-scheduling.usecase';
import { CompleteSchedulingUseCase } from './application/use-cases/complete-scheduling.usecase';
import { SchedulingPrismaRepository } from './infra/repositories/scheduling-prisma.repository';
import { SCHEDULING_REPOSITORY } from './domain/repositories/scheduling.repository.interface';
import { AvailableTimesModule } from '../available-times/available-times.module';

@Module({
  imports: [AvailableTimesModule],
  controllers: [SchedulingsController, SchedulingsListController],
  providers: [
    CreateSchedulingUseCase,
    ConfirmSchedulingUseCase,
    CancelSchedulingUseCase,
    CompleteSchedulingUseCase,
    FindSchedulingsUseCase,
    DeleteSchedulingUseCase,
    {
      provide: SCHEDULING_REPOSITORY,
      useClass: SchedulingPrismaRepository,
    },
  ],
  exports: [
    SCHEDULING_REPOSITORY,
    FindSchedulingsUseCase,
    DeleteSchedulingUseCase,
  ],
})
export class SchedulingsModule {}
