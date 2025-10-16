import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserUseCase } from '../user/application/use-cases/create-user.use-case';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { CreateUserDto } from '../user/application/dtos/create-user.dto';
import { UserResponseDto } from '../user/application/dtos/user-response.dto';
import { ApiResponse as ApiResponseDto } from '../../shared/dtos/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou CPF/email já em uso',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    try {
      if (!createUserDto.password) {
        throw new Error('Senha é obrigatória para registro');
      }

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

      return ApiResponseDto.success(
        'Usuário registrado com sucesso',
        userResponse,
      );
    } catch (error) {
      throw new HttpException(
        ApiResponseDto.error(error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Fazer login no sistema' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    try {
      const loginResponse = await this.authService.login(req.user);
      return ApiResponseDto.success(
        'Login realizado com sucesso',
        loginResponse,
      );
    } catch (error) {
      throw new HttpException(
        ApiResponseDto.error('Erro no login'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
