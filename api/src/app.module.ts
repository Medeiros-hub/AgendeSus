import { Module } from '@nestjs/common';
import { ConfigModule } from './core/infra/config/config.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
