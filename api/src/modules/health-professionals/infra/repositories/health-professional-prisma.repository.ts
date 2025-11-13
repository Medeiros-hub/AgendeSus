import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { IHealthProfessionalRepository } from '../../domain/repositories/health-professional.repository.interface';
import { HealthProfessional } from '../../domain/entities/health-professional.entity';
import { HealthProfessional as PrismaHealthProfessional } from '@prisma/client';

@Injectable()
export class HealthProfessionalPrismaRepository
  implements IHealthProfessionalRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(professional: HealthProfessional): Promise<HealthProfessional> {
    const data = professional.toPersistence();
    const created = await this.prisma.healthProfessional.create({ data });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<HealthProfessional | null> {
    const professional = await this.prisma.healthProfessional.findUnique({
      where: { id },
    });
    return professional ? this.toDomain(professional) : null;
  }

  async findByUbsId(ubsId: string): Promise<HealthProfessional[]> {
    const professionals = await this.prisma.healthProfessional.findMany({
      where: { ubsId },
    });
    return professionals.map(this.toDomain);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ professionals: HealthProfessional[]; total: number }> {
    const skip = (page - 1) * limit;

    const [professionals, total] = await Promise.all([
      this.prisma.healthProfessional.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.healthProfessional.count(),
    ]);

    return { professionals: professionals.map(this.toDomain), total };
  }

  async update(professional: HealthProfessional): Promise<HealthProfessional> {
    const data = professional.toPersistence();
    const updated = await this.prisma.healthProfessional.update({
      where: { id: professional.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.healthProfessional.delete({ where: { id } });
  }

  private toDomain(
    prismaProfessional: PrismaHealthProfessional,
  ): HealthProfessional {
    return new HealthProfessional({
      id: prismaProfessional.id,
      name: prismaProfessional.name,
      specialty: prismaProfessional.specialty,
      crm: prismaProfessional.crm,
      ubsId: prismaProfessional.ubsId,
      createdAt: new Date(),
    });
  }
}
