import { Injectable, Inject, ConflictException } from '@nestjs/common';
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
    const dateObj = this.parseUTCDate(input.date);
    const startTime = this.parseUTCDateTime(input.startTime);
    const endTime = this.parseUTCDateTime(input.endTime);

    const conflicts = await this.availableTimeRepository.findConflicts(
      input.healthProfessionalId,
      startTime,
      endTime,
    );

    if (conflicts.length > 0) {
      const conflictTimes = conflicts
        .map((c) => {
          const startH = String(c.startTime.getUTCHours()).padStart(2, '0');
          const startM = String(c.startTime.getUTCMinutes()).padStart(2, '0');
          const endH = String(c.endTime.getUTCHours()).padStart(2, '0');
          const endM = String(c.endTime.getUTCMinutes()).padStart(2, '0');
          return `${startH}:${startM} - ${endH}:${endM}`;
        })
        .join(', ');

      throw new ConflictException(
        `Já existem horários cadastrados para este profissional no período informado: ${conflictTimes}`,
      );
    }

    const availableTime = new AvailableTime({
      id: uuid(),
      date: dateObj,
      startTime,
      endTime,
      available: true,
      healthProfessionalId: input.healthProfessionalId,
      ubsId: input.ubsId,
      serviceId: input.serviceId,
      createdAt: new Date(),
    });

    const saved = await this.availableTimeRepository.create(availableTime);

    const year = saved.date.getUTCFullYear();
    const month = String(saved.date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(saved.date.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const startHour = String(saved.startTime.getUTCHours()).padStart(2, '0');
    const startMin = String(saved.startTime.getUTCMinutes()).padStart(2, '0');
    const endHour = String(saved.endTime.getUTCHours()).padStart(2, '0');
    const endMin = String(saved.endTime.getUTCMinutes()).padStart(2, '0');

    return new AvailableTimeResponseDto({
      id: saved.id,
      date: dateStr,
      startTime: `${startHour}:${startMin}`,
      endTime: `${endHour}:${endMin}`,
      available: saved.available,
      healthProfessionalId: saved.healthProfessionalId,
      ubsId: saved.ubsId,
      serviceId: saved.serviceId,
    });
  }

  private parseUTCDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }

  private parseUTCDateTime(dateTimeString: string): Date {
    const date = new Date(dateTimeString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));
  }
}
