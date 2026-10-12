import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';
import { Grade } from '../grades/entities/grade.entity.js';
import { Semester } from '../semesters/entities/semester.entity.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Reports resource: exposes the admin platform report under /api/reports. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Semester, Subject, Grade])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
