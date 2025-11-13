import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { EntityNotFoundException } from '../../../../@core/domain/domain.exception';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import { ConfirmSchedulingDto } from '../dto/confirm-scheduling.dto';
import { SchedulingResponseDto } from '../dto/scheduling-response.dto';

interface ConfirmSchedulingInput {
  id: string;
  data: ConfirmSchedulingDto;
}

@Injectable()
export class ConfirmSchedulingUseCase
  implements IUseCase<ConfirmSchedulingInput, SchedulingResponseDto>
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(input: ConfirmSchedulingInput): Promise<SchedulingResponseDto> {
    const scheduling = await this.schedulingRepository.findById(input.id);

    if (!scheduling) {
      throw new EntityNotFoundException('Scheduling', input.id);
    }

    scheduling.confirm(input.data.confirmCode);

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
