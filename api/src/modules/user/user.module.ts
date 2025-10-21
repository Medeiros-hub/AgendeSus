import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { USER_REPOSITORY_TOKEN } from './user.tokens';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    PrismaUserRepository,
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    USER_REPOSITORY_TOKEN,
    PrismaUserRepository,
  ],
})
export class UserModule {}
