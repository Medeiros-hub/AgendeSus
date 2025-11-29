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
import { CreateRecurringAvailableTimesDto } from '../../application/dto/create-recurring-available-times.dto';
import { SearchAvailableTimesDto } from '../../application/dto/search-available-times.dto';
import { GenerateSlotsDto } from '../../application/dto/generate-slots.dto';
import { CreateAvailableTimeUseCase } from '../../application/use-cases/create-available-time.usecase';
import { CreateRecurringAvailableTimesUseCase } from '../../application/use-cases/create-recurring-available-times.usecase';
import { SearchAvailableTimesUseCase } from '../../application/use-cases/search-available-times.usecase';
import { DeleteAvailableTimeUseCase } from '../../application/use-cases/delete-available-time.usecase';
import { GenerateSlotsUseCase } from '../../application/use-cases/generate-slots.usecase';

@Controller('available-times')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailableTimesController {
  constructor(
    private readonly createAvailableTimeUseCase: CreateAvailableTimeUseCase,
    private readonly createRecurringUseCase: CreateRecurringAvailableTimesUseCase,
    private readonly searchAvailableTimesUseCase: SearchAvailableTimesUseCase,
    private readonly deleteAvailableTimeUseCase: DeleteAvailableTimeUseCase,
    private readonly generateSlotsUseCase: GenerateSlotsUseCase,
  ) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAvailableTimeDto: CreateAvailableTimeDto) {
    return this.createAvailableTimeUseCase.execute(createAvailableTimeDto);
  }

  @Post('recurring')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  async createRecurring(
    @Body() createRecurringDto: CreateRecurringAvailableTimesDto,
  ): Promise<any> {
    return this.createRecurringUseCase.execute(createRecurringDto);
  }

  @Post('generate-slots')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  @HttpCode(HttpStatus.CREATED)
  async generateSlots(@Body() generateSlotsDto: GenerateSlotsDto) {
    return this.generateSlotsUseCase.execute(generateSlotsDto);
  }

  @Get()
  @Public()
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('ubsId') ubsId?: string,
    @Query('serviceId') serviceId?: string,
    @Query('healthProfessionalId') healthProfessionalId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const searchDto: SearchAvailableTimesDto = {
      ubsId,
      serviceId,
      healthProfessionalId,
      dateFrom,
      dateTo,
    };

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
