import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../../../../@core/domain/use-case.interface';
import {
  ISchedulingRepository,
  SCHEDULING_REPOSITORY,
} from '../../domain/repositories/scheduling.repository.interface';
import { SchedulingStatus } from '@prisma/client';
import { ReceptionistSchedulingsListResponseDto } from '../dto/receptionist-scheduling-response.dto';
import { PrismaService } from '../../../../@core/infra/prisma.service';

@Injectable()
export class FindSchedulingsUseCase
  implements
    IUseCase<
      {
        page?: number;
        limit?: number;
        status?: SchedulingStatus;
        userId?: string;
      },
      ReceptionistSchedulingsListResponseDto
    >
{
  constructor(
    @Inject(SCHEDULING_REPOSITORY)
    private readonly schedulingRepository: ISchedulingRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: {
      page?: number;
      limit?: number;
      status?: SchedulingStatus;
      userId?: string;
    } = { page: 1, limit: 10 },
  ): Promise<ReceptionistSchedulingsListResponseDto> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (input.userId) {
      where.userId = input.userId;
    }
    if (input.status) {
      where.status = input.status;
    }

    // Get total count
    const total = await this.prisma.scheduling.count({ where });

    // Get raw schedulings with includes from Prisma
    const rawSchedulings = await this.prisma.scheduling.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledAt: 'desc' },
      include: {
        user: true,
        availableTime: {
          include: {
            service: true,
            healthProfessional: true,
            ubs: true,
          },
        },
      },
    });

    // Calculate metrics
    const metrics = await this.calculateMetrics(input.userId);

    return new ReceptionistSchedulingsListResponseDto(
      rawSchedulings,
      total,
      metrics,
    );
  }

  private async calculateMetrics(userId?: string) {
    const where: any = userId ? { userId } : {};

    const [scheduled, confirmed, attended, cancelled, total] =
      await Promise.all([
        this.prisma.scheduling.count({
          where: { ...where, status: SchedulingStatus.SCHEDULED },
        }),
        this.prisma.scheduling.count({
          where: { ...where, status: SchedulingStatus.CONFIRMED },
        }),
        this.prisma.scheduling.count({
          where: { ...where, status: SchedulingStatus.ATTENDED },
        }),
        this.prisma.scheduling.count({
          where: { ...where, status: SchedulingStatus.CANCELLED },
        }),
        this.prisma.scheduling.count({ where }),
      ]);

    return {
      total,
      scheduled,
      confirmed,
      attended,
      cancelled,
    };
  }
}
