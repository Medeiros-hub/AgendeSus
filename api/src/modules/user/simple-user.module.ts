import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SimpleUserController } from './simple-user.controller';

@Module({
  controllers: [SimpleUserController],
  providers: [UserService],
  exports: [UserService],
})
export class SimpleUserModule {}
