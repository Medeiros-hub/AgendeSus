import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { ISchedulingRepository } from '../../domain/repositories/scheduling.repository.interface';
import { Scheduling } from '../../domain/entities/scheduling.entity';
import {
  Scheduling as PrismaScheduling,
  SchedulingStatus,
} from '@prisma/client';

@Injectable()
export class SchedulingPrismaRepository implements ISchedulingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(scheduling: Scheduling): Promise<Scheduling> {
    const data = scheduling.toPersistence();
    const created = await this.prisma.scheduling.create({ data });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Scheduling | null> {
    const scheduling = await this.prisma.scheduling.findUnique({
      where: { id },
    });
    return scheduling ? this.toDomain(scheduling) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ schedulings: Scheduling[]; total: number }> {
    const skip = (page - 1) * limit;

    const [schedulings, total] = await Promise.all([
      this.prisma.scheduling.findMany({
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.scheduling.count(),
    ]);

    return {
      schedulings: schedulings.map(this.toDomain),
      total,
    };
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ schedulings: Scheduling[]; total: number }> {
    const skip = (page - 1) * limit;

    const [schedulings, total] = await Promise.all([
      this.prisma.scheduling.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.scheduling.count({ where: { userId } }),
    ]);

    return {
      schedulings: schedulings.map(this.toDomain),
      total,
    };
  }

  async findByConfirmCode(confirmCode: string): Promise<Scheduling | null> {
    const scheduling = await this.prisma.scheduling.findUnique({
      where: { confirmCode },
    });
    return scheduling ? this.toDomain(scheduling) : null;
  }

  async findByStatus(
    status: SchedulingStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ schedulings: Scheduling[]; total: number }> {
    const skip = (page - 1) * limit;

    const [schedulings, total] = await Promise.all([
      this.prisma.scheduling.findMany({
        where: { status },
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
      }),
      this.prisma.scheduling.count({ where: { status } }),
    ]);

    return {
      schedulings: schedulings.map(this.toDomain),
      total,
    };
  }

  async update(scheduling: Scheduling): Promise<Scheduling> {
    const data = scheduling.toPersistence();
    const updated = await this.prisma.scheduling.update({
      where: { id: scheduling.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.scheduling.delete({ where: { id } });
  }

  private toDomain(prismaScheduling: PrismaScheduling): Scheduling {
    return new Scheduling({
      id: prismaScheduling.id,
      availableTimeId: prismaScheduling.availableTimeId,
      userId: prismaScheduling.userId,
      status: prismaScheduling.status,
      scheduledAt: prismaScheduling.scheduledAt,
      confirmCode: prismaScheduling.confirmCode,
      createdAt: prismaScheduling.scheduledAt,
    });
  }
}
