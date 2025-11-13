import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { EntityNotFoundException } from '../../../../@core/domain/domain.exception';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../../available-times/domain/repositories/available-time.repository.interface';
import { SchedulingResponseDto } from '../dto/scheduling-response.dto';

@Injectable()
export class CancelSchedulingUseCase
  implements IUseCase<string, SchedulingResponseDto>
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly availableTimeRepository: IAvailableTimeRepository,
  ) {}

  async execute(id: string): Promise<SchedulingResponseDto> {
    const scheduling = await this.schedulingRepository.findById(id);

    if (!scheduling) {
      throw new EntityNotFoundException('Scheduling', id);
    }

    scheduling.cancel();

    // Libera horário
    const availableTime = await this.availableTimeRepository.findById(
      scheduling.availableTimeId,
    );
    if (availableTime) {
      availableTime.markAsAvailable();
      await this.availableTimeRepository.update(availableTime);
    }

    const updatedScheduling =
      await this.schedulingRepository.update(scheduling);

    return new SchedulingResponseDto({
      id: updatedScheduling.id,
      availableTimeId: updatedScheduling.availableTimeId,
      userId: updatedScheduling.userId,
      status: updatedScheduling.status,
      scheduledAt: updatedScheduling.scheduledAt,
      confirmCode: updatedScheduling.confirmCode,
      createdAt: updatedScheduling.createdAt,
    });
  }
}
