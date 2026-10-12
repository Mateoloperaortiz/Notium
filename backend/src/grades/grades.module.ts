import { Grade } from './entities/grade.entity.js';
import { GradesController } from './grades.controller.js';
import { GradesService } from './grades.service.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Grades resource: exposes the CRUD under /api/grades. */
@Module({
  imports: [TypeOrmModule.forFeature([Grade, Subject])],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule {}
