import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { CreateUserDto } from './application/dtos/create-user.dto';
import { UpdateUserDto } from './application/dtos/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async create(createUserDto: CreateUserDto) {
    const existingUserByCpf = await this.prisma.user.findUnique({
      where: { cpf: createUserDto.cpf },
    });

    if (existingUserByCpf) {
      throw new Error('CPF já está em uso');
    }

    if (createUserDto.email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUserByEmail) {
        throw new Error('Email já está em uso');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        cpf: createUserDto.cpf,
        fullName: createUserDto.fullName,
        birthDate: new Date(createUserDto.birthDate),
        phone: createUserDto.phone,
        email: createUserDto.email,
        password: hashedPassword,
        type: createUserDto.type || 'CITIZEN',
        zipcode: createUserDto.zipcode,
        address: createUserDto.address,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
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
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
    });
    return user;
  }

  async findByCpf(cpf: string) {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };

    const user = await this.prisma.user.update({
      where: { id },
      data,
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
    });

    return user;
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
