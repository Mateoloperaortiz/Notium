import { AuthModule } from './auth/auth.module.js';
import { DatabaseConfig } from './database/database.config.js';
import { HomeModule } from './home/home.module.js';
import { UsersModule } from './users/users.module.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Root module: opens the database, runs pending migrations and connects the feature modules. */
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...DatabaseConfig.getOptions(), migrationsRun: true }),
    AuthModule,
    HomeModule,
    UsersModule,
  ],
})
export class AppModule {}
