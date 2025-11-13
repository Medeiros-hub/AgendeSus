import { Module } from '@nestjs/common';
import { UsersController } from './interface/http/users.controller';
import { UsersListController } from './interface/http/users.list.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { FindUsersUseCase } from './application/use-cases/find-users.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { UserPrismaRepository } from './infra/repositories/user-prisma.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  controllers: [UsersController, UsersListController],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    FindUsersUseCase,
    DeleteUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [
    USER_REPOSITORY,
    FindUserByIdUseCase,
    FindUsersUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
