import { AuthModule } from './auth/auth.module.js';
import { DatabaseConfig } from './database/database.config.js';
import { GradesModule } from './grades/grades.module.js';
import { HomeModule } from './home/home.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { SemestersModule } from './semesters/semesters.module.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { UsersModule } from './users/users.module.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Root module: opens the database, runs pending migrations and connects the feature modules. */
@Module({
  imports: [
    TypeOrmModule.forRoot({ ...DatabaseConfig.getOptions(), migrationsRun: true }),
    AuthModule,
    GradesModule,
    HomeModule,
    ReportsModule,
    SemestersModule,
    SubjectsModule,
    UsersModule,
  ],
})
export class AppModule {}
