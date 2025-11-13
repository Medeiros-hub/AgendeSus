import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Public } from '../../../../shared/decorators/public.decorator';
import { UserType } from '@prisma/client';
import { CreateServiceDto } from '../../application/dto/create-service.dto';
import { CreateServiceUseCase } from '../../application/use-cases/create-service.usecase';
import { DeleteServiceUseCase } from '../../application/use-cases/delete-service.usecase';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Post()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.createServiceUseCase.execute(createServiceDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    return this.deleteServiceUseCase.execute(id);
  }
}
