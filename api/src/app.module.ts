import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './@core/infra/database.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SchedulingsModule } from './modules/schedulings/schedulings.module';
import { AvailableTimesModule } from './modules/available-times/available-times.module';
import { UBSModule } from './modules/ubs/ubs.module';
import { ServicesModule } from './modules/services/services.module';
import { HealthProfessionalsModule } from './modules/health-professionals/health-professionals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SchedulingsModule,
    AvailableTimesModule,
    UBSModule,
    ServicesModule,
    HealthProfessionalsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
