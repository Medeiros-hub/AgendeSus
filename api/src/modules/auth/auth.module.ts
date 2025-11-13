import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './interface/http/auth.controller';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { JwtService } from './application/services/jwt.service';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { JwtConfig } from '../../config/jwt.config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [JwtConfig, JwtService, JwtStrategy, LoginUseCase],
  exports: [JwtService],
})
export class AuthModule {}
