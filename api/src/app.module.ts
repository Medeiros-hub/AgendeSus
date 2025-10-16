import { Module } from '@nestjs/common';
import { ConfigModule } from './core/infra/config/config.module';
import { SimpleUserModule } from './modules/user/simple-user.module';

@Module({
  imports: [ConfigModule, SimpleUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
