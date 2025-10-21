import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { ApiResponse as ApiResponseDto } from '../../../../shared/dtos/api-response.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserType } from '../../domain/entities/user.entity';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('users')
@ApiCookieAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou CPF/email já em uso',
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    try {
      const { user } = await this.createUserUseCase.execute(createUserDto);

      const userResponse: UserResponseDto = {
        id: user.id!,
        cpf: user.cpf,
        fullName: user.fullName,
        birthDate: user.birthDate,
        phone: user.phone,
        email: user.email,
        type: user.type,
        zipcode: user.zipcode,
        address: user.address,
        createdAt: user.createdAt!,
      };

      return ApiResponseDto.success('Usuário criado com sucesso', userResponse);
    } catch (error) {
      throw new HttpException(
        ApiResponseDto.error(error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  async findAll(
    @Query() query: any,
  ): Promise<ApiResponseDto<UserResponseDto[]>> {
    try {
      const page = query?.page ? Number(query.page) : undefined;
      const limit = query?.limit ? Number(query.limit) : undefined;

      const { users } = await this.getAllUsersUseCase.execute({ page, limit });

      const usersResponse: UserResponseDto[] = users.map((user) => ({
        id: user.id!,
        cpf: user.cpf,
        fullName: user.fullName,
        birthDate: user.birthDate,
        phone: user.phone,
        email: user.email,
        type: user.type,
        zipcode: user.zipcode,
        address: user.address,
        createdAt: user.createdAt!,
      }));

      return ApiResponseDto.success('Usuários encontrados', usersResponse);
    } catch (error) {
      throw new HttpException(
        ApiResponseDto.error('Erro interno do servidor'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    try {
      const { user } = await this.getUserByIdUseCase.execute({ id });

      if (!user) {
        throw new HttpException(
          ApiResponseDto.error('Usuário não encontrado'),
          HttpStatus.NOT_FOUND,
        );
      }

      const userResponse: UserResponseDto = {
        id: user.id!,
        cpf: user.cpf,
        fullName: user.fullName,
        birthDate: user.birthDate,
        phone: user.phone,
        email: user.email,
        type: user.type,
        zipcode: user.zipcode,
        address: user.address,
        createdAt: user.createdAt!,
      };

      return ApiResponseDto.success('Usuário encontrado', userResponse);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ApiResponseDto.error('Erro interno do servidor'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    try {
      const { user } = await this.updateUserUseCase.execute({
        id,
        ...updateUserDto,
      });

      if (!user) {
        throw new HttpException(
          ApiResponseDto.error('Usuário não encontrado'),
          HttpStatus.NOT_FOUND,
        );
      }

      const userResponse: UserResponseDto = {
        id: user.id!,
        cpf: user.cpf,
        fullName: user.fullName,
        birthDate: user.birthDate,
        phone: user.phone,
        email: user.email,
        type: user.type,
        zipcode: user.zipcode,
        address: user.address,
        createdAt: user.createdAt!,
      };

      return ApiResponseDto.success(
        'Usuário atualizado com sucesso',
        userResponse,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ApiResponseDto.error(error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
