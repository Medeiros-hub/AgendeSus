import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User, UserType } from '../../domain/entities/user.entity';
import { PrismaClient } from '../../../../../generated/prisma';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(user: User): Promise<User> {
    const userData = user.toPlainObject();

    const createdUser = await this.prisma.user.create({
      data: {
        cpf: userData.cpf,
        fullName: userData.fullName,
        birthDate: userData.birthDate,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        type: userData.type as any,
        zipcode: userData.zipcode,
        address: userData.address,
      },
    });

    return new User({
      id: createdUser.id,
      cpf: createdUser.cpf,
      fullName: createdUser.fullName,
      birthDate: createdUser.birthDate,
      phone: createdUser.phone,
      email: createdUser.email,
      password: createdUser.password,
      type: createdUser.type as UserType,
      zipcode: createdUser.zipcode,
      address: createdUser.address,
      createdAt: createdUser.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      cpf: user.cpf,
      fullName: user.fullName,
      birthDate: user.birthDate,
      phone: user.phone,
      email: user.email,
      password: user.password,
      type: user.type as UserType,
      zipcode: user.zipcode,
      address: user.address,
      createdAt: user.createdAt,
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      cpf: user.cpf,
      fullName: user.fullName,
      birthDate: user.birthDate,
      phone: user.phone,
      email: user.email,
      password: user.password,
      type: user.type as UserType,
      zipcode: user.zipcode,
      address: user.address,
      createdAt: user.createdAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      cpf: user.cpf,
      fullName: user.fullName,
      birthDate: user.birthDate,
      phone: user.phone,
      email: user.email,
      password: user.password,
      type: user.type as UserType,
      zipcode: user.zipcode,
      address: user.address,
      createdAt: user.createdAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(
      (user) =>
        new User({
          id: user.id,
          cpf: user.cpf,
          fullName: user.fullName,
          birthDate: user.birthDate,
          phone: user.phone,
          email: user.email,
          password: user.password,
          type: user.type as UserType,
          zipcode: user.zipcode,
          address: user.address,
          createdAt: user.createdAt,
        }),
    );
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          zipcode: data.zipcode,
          address: data.address,
        },
      });

      return new User({
        id: updatedUser.id,
        cpf: updatedUser.cpf,
        fullName: updatedUser.fullName,
        birthDate: updatedUser.birthDate,
        phone: updatedUser.phone,
        email: updatedUser.email,
        password: updatedUser.password,
        type: updatedUser.type as UserType,
        zipcode: updatedUser.zipcode,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async existsByCpf(cpf: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
      select: { id: true },
    });
    return !!user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
}
