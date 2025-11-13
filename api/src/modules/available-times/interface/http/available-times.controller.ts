import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Public } from '../../../../shared/decorators/public.decorator';
import { UserType } from '@prisma/client';
import { CreateAvailableTimeDto } from '../../application/dto/create-available-time.dto';
import { SearchAvailableTimesDto } from '../../application/dto/search-available-times.dto';
import { CreateAvailableTimeUseCase } from '../../application/use-cases/create-available-time.usecase';
import { SearchAvailableTimesUseCase } from '../../application/use-cases/search-available-times.usecase';
import { DeleteAvailableTimeUseCase } from '../../application/use-cases/delete-available-time.usecase';

@Controller('available-times')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailableTimesController {
  constructor(
    private readonly createAvailableTimeUseCase: CreateAvailableTimeUseCase,
    private readonly searchAvailableTimesUseCase: SearchAvailableTimesUseCase,
    private readonly deleteAvailableTimeUseCase: DeleteAvailableTimeUseCase,
  ) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAvailableTimeDto: CreateAvailableTimeDto) {
    return this.createAvailableTimeUseCase.execute(createAvailableTimeDto);
  }

  @Get()
  async search(
    @Query() searchDto: SearchAvailableTimesDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.searchAvailableTimesUseCase.execute({
      filters: searchDto,
      page,
      limit,
    });
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async remove(@Param('id') id: string) {
    return this.deleteAvailableTimeUseCase.execute(id);
  }
}
