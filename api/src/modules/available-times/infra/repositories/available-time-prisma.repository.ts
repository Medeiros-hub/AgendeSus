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

    // Construir filtro de data corretamente
    const dateFilter: any = {};
    if (filters.dateFrom) {
      dateFilter.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      dateFilter.lte = filters.dateTo;
    }

    const where: Prisma.AvailableTimeWhereInput = {
      ...(filters.ubsId && { ubsId: filters.ubsId }),
      ...(filters.serviceId && { serviceId: filters.serviceId }),
      ...(filters.healthProfessionalId && {
        healthProfessionalId: filters.healthProfessionalId,
      }),
      ...(filters.available !== undefined && { available: filters.available }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
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

  async findConflicts(
    healthProfessionalId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<AvailableTime[]> {
    // Busca horários do mesmo profissional que se sobrepõem ao período informado
    const conflicts = await this.prisma.availableTime.findMany({
      where: {
        healthProfessionalId,
        OR: [
          // Caso 1: Horário existente começa durante o novo período
          {
            AND: [
              { startTime: { gte: startTime } },
              { startTime: { lt: endTime } },
            ],
          },
          // Caso 2: Horário existente termina durante o novo período
          {
            AND: [
              { endTime: { gt: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
          // Caso 3: Horário existente engloba completamente o novo período
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    return conflicts.map(this.toDomain);
  }

  private toDomain(prismaTime: PrismaAvailableTime): AvailableTime {
    // Garantir que as datas sejam interpretadas como UTC
    const date = new Date(
      Date.UTC(
        prismaTime.date.getUTCFullYear(),
        prismaTime.date.getUTCMonth(),
        prismaTime.date.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const startTime = new Date(
      Date.UTC(
        prismaTime.startTime.getUTCFullYear(),
        prismaTime.startTime.getUTCMonth(),
        prismaTime.startTime.getUTCDate(),
        prismaTime.startTime.getUTCHours(),
        prismaTime.startTime.getUTCMinutes(),
        0,
        0,
      ),
    );

    const endTime = new Date(
      Date.UTC(
        prismaTime.endTime.getUTCFullYear(),
        prismaTime.endTime.getUTCMonth(),
        prismaTime.endTime.getUTCDate(),
        prismaTime.endTime.getUTCHours(),
        prismaTime.endTime.getUTCMinutes(),
        0,
        0,
      ),
    );

    return new AvailableTime({
      id: prismaTime.id,
      date,
      startTime,
      endTime,
      available: prismaTime.available,
      healthProfessionalId: prismaTime.healthProfessionalId,
      ubsId: prismaTime.ubsId,
      serviceId: prismaTime.serviceId,
      createdAt: prismaTime.date,
    });
  }
}
