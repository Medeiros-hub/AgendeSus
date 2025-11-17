import { Module } from '@nestjs/common';
import { AvailableTimesController } from './interface/http/available-times.controller';
import { AvailableTimesListController } from './interface/http/available-times.list.controller';
import { CreateAvailableTimeUseCase } from './application/use-cases/create-available-time.usecase';
import { CreateRecurringAvailableTimesUseCase } from './application/use-cases/create-recurring-available-times.usecase';
import { SearchAvailableTimesUseCase } from './application/use-cases/search-available-times.usecase';
import { FindAvailableTimesUseCase } from './application/use-cases/find-available-times.usecase';
import { DeleteAvailableTimeUseCase } from './application/use-cases/delete-available-time.usecase';
import { GenerateSlotsUseCase } from './application/use-cases/generate-slots.usecase';
import { AvailableTimePrismaRepository } from './infra/repositories/available-time-prisma.repository';
import { AVAILABLE_TIME_REPOSITORY } from './domain/repositories/available-time.repository.interface';

@Module({
  controllers: [AvailableTimesController, AvailableTimesListController],
  providers: [
    CreateAvailableTimeUseCase,
    CreateRecurringAvailableTimesUseCase,
    SearchAvailableTimesUseCase,
    FindAvailableTimesUseCase,
    DeleteAvailableTimeUseCase,
    GenerateSlotsUseCase,
    {
      provide: AVAILABLE_TIME_REPOSITORY,
      useClass: AvailableTimePrismaRepository,
    },
  ],
  exports: [
    AVAILABLE_TIME_REPOSITORY,
    FindAvailableTimesUseCase,
    DeleteAvailableTimeUseCase,
  ],
})
export class AvailableTimesModule {}
