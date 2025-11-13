import {
  Controller,
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
import { UserType } from '@prisma/client';
import { CreateHealthProfessionalDto } from '../../application/dto/create-health-professional.dto';
import { CreateHealthProfessionalUseCase } from '../../application/use-cases/create-health-professional.usecase';
import { DeleteHealthProfessionalUseCase } from '../../application/use-cases/delete-health-professional.usecase';

@Controller('health-professionals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthProfessionalsController {
  constructor(
    private readonly createUseCase: CreateHealthProfessionalUseCase,
    private readonly deleteUseCase: DeleteHealthProfessionalUseCase,
  ) {}

  @Post()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateHealthProfessionalDto) {
    return this.createUseCase.execute(createDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(id);
  }
}
