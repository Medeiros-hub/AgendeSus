import { Module } from '@nestjs/common';
import { ConfigModule as RootNestConfig } from '@nestjs/config';

@Module({
  imports: [
    RootNestConfig.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
  ],
})
export class ConfigModule {}
