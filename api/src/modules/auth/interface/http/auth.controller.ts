import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { Public } from '../../../../shared/decorators/public.decorator';
import { JwtConfig } from '../../../../config/jwt.config';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtConfig: JwtConfig,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { response: loginResponse, token } =
      await this.loginUseCase.execute(loginDto);

    // Define cookie HTTP-only
    response.cookie(
      this.jwtConfig.cookieName,
      token,
      this.jwtConfig.cookieOptions,
    );

    return loginResponse;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.jwtConfig.cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return;
  }
}
