import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../@core/infra/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CPF } from '../../domain/value-objects/cpf.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { User as PrismaUser } from '@prisma/client';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = user.toPersistence();
    const created = await this.prisma.user.create({ data });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { cpf } });
    return user ? this.toDomain(user) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: string,
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          cpf: true,
          fullName: true,
          birthDate: true,
          phone: true,
          email: true,
          type: true,
          zipcode: true,
          address: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map(this.toDomain),
      total,
    };
  }

  async update(user: User): Promise<User> {
    const data = user.toPersistence();
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      cpf: new CPF(prismaUser.cpf),
      fullName: prismaUser.fullName,
      birthDate: prismaUser.birthDate,
      phone: prismaUser.phone,
      email: new Email(prismaUser.email),
      password: prismaUser.password,
      type: prismaUser.type,
      zipcode: prismaUser.zipcode,
      address: prismaUser.address,
      createdAt: prismaUser.createdAt,
    });
  }
}
