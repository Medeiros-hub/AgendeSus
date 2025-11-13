import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Public } from '../../../../shared/decorators/public.decorator';
import {
  CurrentUser,
  CurrentUserData,
} from '../../../../shared/decorators/current-user.decorator';
import { UserType } from '@prisma/client';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.findUserByIdUseCase.execute(user.userId);
  }

  @Get('logged')
  async getLogged(@CurrentUser() user: CurrentUserData) {
    return this.findUserByIdUseCase.execute(user.userId);
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  async findOne(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    if (user.type !== UserType.ADMIN && user.userId !== id) {
      throw new Error('Não autorizado');
    }

    return this.updateUserUseCase.execute({ id, data: updateUserDto });
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
