import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserUseCase } from '../user/application/use-cases/create-user.use-case';
import { LoginDto, LoginResponseDto } from './dtos/login.dto';
import { CreateUserDto } from '../user/application/dtos/create-user.dto';
import { UserResponseDto } from '../user/application/dtos/user-response.dto';
import { ApiResponse as ApiResponseDto } from '../../shared/dtos/api-response.dto';
import { Response } from 'express';

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
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    try {
      const loginResponse = await this.authService.validateUser(
        loginDto.identifier,
        loginDto.password,
      );

      response.cookie('userToken', loginResponse.access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      });

      return ApiResponseDto.success(
        'Login realizado com sucesso',
        loginResponse,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ApiResponseDto.error('Erro no login'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('userToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return ApiResponseDto.success('Logout realizado com sucesso', null);
  }
}
