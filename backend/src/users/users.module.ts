import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** User accounts; exports UsersService so the auth module can look users up. */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
