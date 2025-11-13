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
        ? new Date(input.filters.dateFrom)
        : undefined,
      dateTo: input.filters.dateTo ? new Date(input.filters.dateTo) : undefined,
      available: true, // Apenas disponíveis
    };

    const { times, total } = await this.availableTimeRepository.findAvailable(
      filters,
      input.page,
      input.limit,
    );

    return {
      times: times.map(
        (time) =>
          new AvailableTimeResponseDto({
            id: time.id,
            date: time.date,
            startTime: time.startTime,
            endTime: time.endTime,
            available: time.available,
            healthProfessionalId: time.healthProfessionalId,
            ubsId: time.ubsId,
            serviceId: time.serviceId,
          }),
      ),
      total,
    };
  }
}
