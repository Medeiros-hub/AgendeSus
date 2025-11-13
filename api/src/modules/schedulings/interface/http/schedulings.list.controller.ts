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
import { FindSchedulingsUseCase } from '../../application/use-cases/find-schedulings.usecase';
import { SchedulingStatus } from '@prisma/client';

@Controller('schedulings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingsListController {
  constructor(
    private readonly findSchedulingsUseCase: FindSchedulingsUseCase,
  ) {}

  @Get()
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async findAll(
    @Query('status') status: SchedulingStatus,
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.findSchedulingsUseCase.execute({ status, userId, page, limit });
  }
}
