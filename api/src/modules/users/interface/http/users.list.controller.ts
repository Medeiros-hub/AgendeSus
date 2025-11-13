import {
  Controller,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { FindUsersUseCase } from '../../application/use-cases/find-users.usecase';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersListController {
  constructor(private readonly findUsersUseCase: FindUsersUseCase) {}

  @Get()
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.findUsersUseCase.execute({ page, limit });
  }
}
