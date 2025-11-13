import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { IServiceRepository } from '../../domain/repositories/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';
import { Service as PrismaServiceModel } from '@prisma/client';

@Injectable()
export class ServicePrismaRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(service: Service): Promise<Service> {
    const data = service.toPersistence();
    const created = await this.prisma.service.create({ data });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    return service ? this.toDomain(service) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ services: Service[]; total: number }> {
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.service.count(),
    ]);

    return { services: services.map(this.toDomain), total };
  }

  async update(service: Service): Promise<Service> {
    const data = service.toPersistence();
    const updated = await this.prisma.service.update({
      where: { id: service.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({ where: { id } });
  }

  private toDomain(prismaService: PrismaServiceModel): Service {
    return new Service({
      id: prismaService.id,
      name: prismaService.name,
      description: prismaService.description,
      durationMinutes: prismaService.durationMinutes,
      createdAt: prismaService.createdAt,
    });
  }
}
