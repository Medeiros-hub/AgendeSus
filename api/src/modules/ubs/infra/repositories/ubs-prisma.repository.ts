import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { IUBSRepository } from '../../domain/repositories/ubs.repository.interface';
import { UBS } from '../../domain/entities/ubs.entity';
import { UBS as PrismaUBS } from '@prisma/client';

@Injectable()
export class UBSPrismaRepository implements IUBSRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ubs: UBS): Promise<UBS> {
    const data = ubs.toPersistence();
    const created = await this.prisma.uBS.create({ data });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<UBS | null> {
    const ubs = await this.prisma.uBS.findUnique({ where: { id } });
    return ubs ? this.toDomain(ubs) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ ubsList: UBS[]; total: number }> {
    const skip = (page - 1) * limit;

    const [ubsList, total] = await Promise.all([
      this.prisma.uBS.findMany({ skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.uBS.count(),
    ]);

    return { ubsList: ubsList.map(this.toDomain), total };
  }

  async update(ubs: UBS): Promise<UBS> {
    const data = ubs.toPersistence();
    const updated = await this.prisma.uBS.update({
      where: { id: ubs.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.uBS.delete({ where: { id } });
  }

  private toDomain(prismaUBS: PrismaUBS): UBS {
    return new UBS({
      id: prismaUBS.id,
      name: prismaUBS.name,
      cep: prismaUBS.cep,
      address: prismaUBS.address,
      phone: prismaUBS.phone,
      createdAt: prismaUBS.createdAt,
    });
  }
}
