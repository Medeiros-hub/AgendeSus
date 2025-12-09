import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { EntityNotFoundException } from '../../../../@core/domain/domain.exception';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import { SchedulingResponseDto } from '../dto/scheduling-response.dto';

@Injectable()
export class CompleteSchedulingUseCase
  implements IUseCase<string, SchedulingResponseDto>
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(id: string): Promise<SchedulingResponseDto> {
    const scheduling = await this.schedulingRepository.findById(id);

    if (!scheduling) {
      throw new EntityNotFoundException('Agendamento', id);
    }

    scheduling.markAsAttended();

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
