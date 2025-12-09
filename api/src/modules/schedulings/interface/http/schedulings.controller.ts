import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Delete,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '../../../../shared/decorators/current-user.decorator';
import { UserType } from '@prisma/client';
import { CreateSchedulingDto } from '../../application/dto/create-scheduling.dto';
import { ConfirmSchedulingDto } from '../../application/dto/confirm-scheduling.dto';
import { CreateSchedulingUseCase } from '../../application/use-cases/create-scheduling.usecase';
import { ConfirmSchedulingUseCase } from '../../application/use-cases/confirm-scheduling.usecase';
import { CancelSchedulingUseCase } from '../../application/use-cases/cancel-scheduling.usecase';
import { DeleteSchedulingUseCase } from '../../application/use-cases/delete-scheduling.usecase';
import { FindSchedulingsUseCase } from '../../application/use-cases/find-schedulings.usecase';
import { CompleteSchedulingUseCase } from '../../application/use-cases/complete-scheduling.usecase';

@Controller('schedulings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingsController {
  constructor(
    private readonly createSchedulingUseCase: CreateSchedulingUseCase,
    private readonly confirmSchedulingUseCase: ConfirmSchedulingUseCase,
    private readonly cancelSchedulingUseCase: CancelSchedulingUseCase,
    private readonly deleteSchedulingUseCase: DeleteSchedulingUseCase,
    private readonly findSchedulingsUseCase: FindSchedulingsUseCase,
    private readonly completeSchedulingUseCase: CompleteSchedulingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSchedulingDto: CreateSchedulingDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.createSchedulingUseCase.execute({
      userId: user.userId,
      data: createSchedulingDto,
    });
  }

  @Get('my')
  async getMySchedulings(
    @CurrentUser() user: CurrentUserData,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.findSchedulingsUseCase.execute({
      userId: user.userId,
      page,
      limit,
    });
  }

  @Patch(':id/confirm')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async confirm(
    @Param('id') id: string,
    @Body() confirmSchedulingDto: ConfirmSchedulingDto,
  ) {
    return this.confirmSchedulingUseCase.execute({
      id,
      data: confirmSchedulingDto,
    });
  }

  @Patch(':id/complete')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async complete(@Param('id') id: string) {
    return this.completeSchedulingUseCase.execute(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.cancelSchedulingUseCase.execute(id);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async remove(@Param('id') id: string) {
    return this.deleteSchedulingUseCase.execute(id);
  }
}
