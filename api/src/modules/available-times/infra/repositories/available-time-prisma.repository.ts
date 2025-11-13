import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import {
  IAvailableTimeRepository,
  SearchAvailableTimesFilters,
} from '../../domain/repositories/available-time.repository.interface';
import { AvailableTime } from '../../domain/entities/available-time.entity';
import { AvailableTime as PrismaAvailableTime, Prisma } from '@prisma/client';

@Injectable()
export class AvailableTimePrismaRepository implements IAvailableTimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(availableTime: AvailableTime): Promise<AvailableTime> {
    const data = availableTime.toPersistence();
    const created = await this.prisma.availableTime.create({ data });
    return this.toDomain(created);
  }

  async createMany(availableTimes: AvailableTime[]): Promise<AvailableTime[]> {
    const data = availableTimes.map((at) => at.toPersistence());
    await this.prisma.availableTime.createMany({ data });
    return availableTimes;
  }

  async findById(id: string): Promise<AvailableTime | null> {
    const time = await this.prisma.availableTime.findUnique({ where: { id } });
    return time ? this.toDomain(time) : null;
  }

  async findAvailable(
    filters: SearchAvailableTimesFilters,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ times: AvailableTime[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.AvailableTimeWhereInput = {
      ...(filters.ubsId && { ubsId: filters.ubsId }),
      ...(filters.serviceId && { serviceId: filters.serviceId }),
      ...(filters.healthProfessionalId && {
        healthProfessionalId: filters.healthProfessionalId,
      }),
      ...(filters.available !== undefined && { available: filters.available }),
      ...(filters.dateFrom && { date: { gte: filters.dateFrom } }),
      ...(filters.dateTo && { date: { lte: filters.dateTo } }),
    };

    const [times, total] = await Promise.all([
      this.prisma.availableTime.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      }),
      this.prisma.availableTime.count({ where }),
    ]);

    return {
      times: times.map(this.toDomain),
      total,
    };
  }

  async update(availableTime: AvailableTime): Promise<AvailableTime> {
    const data = availableTime.toPersistence();
    const updated = await this.prisma.availableTime.update({
      where: { id: availableTime.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.availableTime.delete({ where: { id } });
  }

  private toDomain(prismaTime: PrismaAvailableTime): AvailableTime {
    return new AvailableTime({
      id: prismaTime.id,
      date: prismaTime.date,
      startTime: prismaTime.startTime,
      endTime: prismaTime.endTime,
      available: prismaTime.available,
      healthProfessionalId: prismaTime.healthProfessionalId,
      ubsId: prismaTime.ubsId,
      serviceId: prismaTime.serviceId,
      createdAt: prismaTime.date,
    });
  }
}
