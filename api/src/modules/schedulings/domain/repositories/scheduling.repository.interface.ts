import { Scheduling } from '../entities/scheduling.entity';
import { SchedulingStatus } from '@prisma/client';

export interface ISchedulingRepository {
  create(scheduling: Scheduling): Promise<Scheduling>;
  findById(id: string): Promise<Scheduling | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ schedulings: Scheduling[]; total: number }>;
  findByConfirmCode(confirmCode: string): Promise<Scheduling | null>;
  findByStatus(
    status: SchedulingStatus,
    page: number,
    limit: number,
  ): Promise<{ schedulings: Scheduling[]; total: number }>;
  update(scheduling: Scheduling): Promise<Scheduling>;
  delete(id: string): Promise<void>;
}

export const SCHEDULING_REPOSITORY = Symbol('ISchedulingRepository');
