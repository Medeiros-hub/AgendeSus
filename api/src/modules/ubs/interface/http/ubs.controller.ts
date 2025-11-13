import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { CreateUBSDto } from '../../application/dto/create-ubs.dto';
import { CreateUBSUseCase } from '../../application/use-cases/create-ubs.usecase';
import { DeleteUBSUseCase } from '../../application/use-cases/delete-ubs.usecase';

@Controller('ubs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UBSController {
  constructor(
    private readonly createUBSUseCase: CreateUBSUseCase,
    private readonly deleteUBSUseCase: DeleteUBSUseCase,
  ) {}

  @Post()
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUBSDto: CreateUBSDto) {
    return this.createUBSUseCase.execute(createUBSDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    return this.deleteUBSUseCase.execute(id);
  }
}
