import { Module } from '@nestjs/common';
import { ConfigModule } from './core/infra/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
