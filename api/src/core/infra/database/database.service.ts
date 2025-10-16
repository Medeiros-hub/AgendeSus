import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn'],
    });
  }

  async onModuleInit() {
    return await this.$connect();
  }

  async onModuleDestroy() {
    return await this.$disconnect();
  }
}
