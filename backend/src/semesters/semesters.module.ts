import { Semester } from './entities/semester.entity.js';
import { SemestersController } from './semesters.controller.js';
import { SemestersService } from './semesters.service.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Semesters resource: exposes the CRUD under /api/semesters. */
@Module({
  imports: [TypeOrmModule.forFeature([Semester])],
  controllers: [SemestersController],
  providers: [SemestersService],
})
export class SemestersModule {}
