import { Subject } from './entities/subject.entity.js';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';
import { Semester } from '../semesters/entities/semester.entity.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Subjects resource: exposes the CRUD under /api/subjects. */
@Module({
  imports: [TypeOrmModule.forFeature([Subject, Semester])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
