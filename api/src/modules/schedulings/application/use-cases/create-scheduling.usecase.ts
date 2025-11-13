import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Scheduling } from '../../domain/entities/scheduling.entity';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../../available-times/domain/repositories/available-time.repository.interface';
import { CreateSchedulingDto } from '../dto/create-scheduling.dto';
import { SchedulingResponseDto } from '../dto/scheduling-response.dto';
import { SchedulingStatus } from '@prisma/client';
import { IUseCase } from '@/@core/domain/use-case.interface';

interface CreateSchedulingInput {
  userId: string;
  data: CreateSchedulingDto;
}

@Injectable()
export class CreateSchedulingUseCase
  implements IUseCase<CreateSchedulingInput, SchedulingResponseDto>
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly availableTimeRepository: IAvailableTimeRepository,
  ) {}

  async execute(input: CreateSchedulingInput): Promise<SchedulingResponseDto> {
    const availableTime = await this.availableTimeRepository.findById(
      input.data.availableTimeId,
    );

    if (!availableTime) {
      throw new BadRequestException('Horário não encontrado');
    }

    if (!availableTime.available) {
      throw new BadRequestException('Horário não está mais disponível');
    }

    if (availableTime.date < new Date()) {
      throw new BadRequestException('Não é possível agendar em datas passadas');
    }

    const confirmCode = this.generateConfirmCode();

    const scheduling = new Scheduling({
      id: uuid(),
      availableTimeId: input.data.availableTimeId,
      userId: input.userId,
      status: SchedulingStatus.SCHEDULED,
      scheduledAt: availableTime.date,
      confirmCode,
      createdAt: new Date(),
    });

    availableTime.markAsUnavailable();
    await this.availableTimeRepository.update(availableTime);

    const savedScheduling = await this.schedulingRepository.create(scheduling);

    return new SchedulingResponseDto({
      id: savedScheduling.id,
      availableTimeId: savedScheduling.availableTimeId,
      userId: savedScheduling.userId,
      status: savedScheduling.status,
      scheduledAt: savedScheduling.scheduledAt,
      confirmCode: savedScheduling.confirmCode,
      createdAt: savedScheduling.createdAt,
    });
  }

  private generateConfirmCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
