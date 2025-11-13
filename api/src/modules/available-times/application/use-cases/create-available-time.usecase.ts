import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import { AvailableTime } from '../../domain/entities/available-time.entity';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
} from '../../domain/repositories/available-time.repository.interface';
import { CreateAvailableTimeDto } from '../dto/create-available-time.dto';
import { AvailableTimeResponseDto } from '../dto/available-time-response.dto';

@Injectable()
export class CreateAvailableTimeUseCase
  implements IUseCase<CreateAvailableTimeDto, AvailableTimeResponseDto>
{
  constructor(
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly availableTimeRepository: IAvailableTimeRepository,
  ) {}

  async execute(
    input: CreateAvailableTimeDto,
  ): Promise<AvailableTimeResponseDto> {
    const availableTime = new AvailableTime({
      id: uuid(),
      date: new Date(input.date),
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      available: true,
      healthProfessionalId: input.healthProfessionalId,
      ubsId: input.ubsId,
      serviceId: input.serviceId,
      createdAt: new Date(),
    });

    const saved = await this.availableTimeRepository.create(availableTime);

    return new AvailableTimeResponseDto({
      id: saved.id,
      date: saved.date,
      startTime: saved.startTime,
      endTime: saved.endTime,
      available: saved.available,
      healthProfessionalId: saved.healthProfessionalId,
      ubsId: saved.ubsId,
      serviceId: saved.serviceId,
    });
  }
}
