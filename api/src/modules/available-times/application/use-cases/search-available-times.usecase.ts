import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  IAvailableTimeRepository,
  AVAILABLE_TIME_REPOSITORY,
  SearchAvailableTimesFilters,
} from '../../domain/repositories/available-time.repository.interface';
import { SearchAvailableTimesDto } from '../dto/search-available-times.dto';
import { AvailableTimeResponseDto } from '../dto/available-time-response.dto';

interface SearchInput {
  filters: SearchAvailableTimesDto;
  page: number;
  limit: number;
}

@Injectable()
export class SearchAvailableTimesUseCase
  implements
    IUseCase<SearchInput, { times: AvailableTimeResponseDto[]; total: number }>
{
  constructor(
    @Inject(AVAILABLE_TIME_REPOSITORY)
    private readonly availableTimeRepository: IAvailableTimeRepository,
  ) {}

  async execute(
    input: SearchInput,
  ): Promise<{ times: AvailableTimeResponseDto[]; total: number }> {
    const filters: SearchAvailableTimesFilters = {
      ubsId: input.filters.ubsId,
      serviceId: input.filters.serviceId,
      healthProfessionalId: input.filters.healthProfessionalId,
      dateFrom: input.filters.dateFrom
        ? this.parseUTCDate(input.filters.dateFrom)
        : undefined,
      dateTo: input.filters.dateTo
        ? this.parseUTCDate(input.filters.dateTo)
        : undefined,
      available: true,
    };

    const { times, total } = await this.availableTimeRepository.findAvailable(
      filters,
      input.page,
      input.limit,
    );

    return {
      times: times.map((time) => {
        const year = time.date.getUTCFullYear();
        const month = String(time.date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(time.date.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const startHour = String(time.startTime.getUTCHours()).padStart(2, '0');
        const startMin = String(time.startTime.getUTCMinutes()).padStart(
          2,
          '0',
        );
        const endHour = String(time.endTime.getUTCHours()).padStart(2, '0');
        const endMin = String(time.endTime.getUTCMinutes()).padStart(2, '0');

        return new AvailableTimeResponseDto({
          id: time.id,
          date: dateStr,
          startTime: `${startHour}:${startMin}`,
          endTime: `${endHour}:${endMin}`,
          available: time.available,
          healthProfessionalId: time.healthProfessionalId,
          ubsId: time.ubsId,
          serviceId: time.serviceId,
        });
      }),
      total,
    };
  }

  private parseUTCDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }
}
