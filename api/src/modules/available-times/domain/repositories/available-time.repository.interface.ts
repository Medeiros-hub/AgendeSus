import { AvailableTime } from '../entities/available-time.entity';

export interface SearchAvailableTimesFilters {
  ubsId?: string;
  serviceId?: string;
  healthProfessionalId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  available?: boolean;
}

export interface IAvailableTimeRepository {
  create(availableTime: AvailableTime): Promise<AvailableTime>;
  createMany(availableTimes: AvailableTime[]): Promise<AvailableTime[]>;
  findById(id: string): Promise<AvailableTime | null>;
  findAvailable(
    filters: SearchAvailableTimesFilters,
    page: number,
    limit: number,
  ): Promise<{ times: AvailableTime[]; total: number }>;
  update(availableTime: AvailableTime): Promise<AvailableTime>;
  delete(id: string): Promise<void>;
}

export const AVAILABLE_TIME_REPOSITORY = Symbol('IAvailableTimeRepository');
