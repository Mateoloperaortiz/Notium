import type { PlatformReport } from './interfaces/platform-report.interface.js';
import { Grade } from '../grades/entities/grade.entity.js';
import { Semester } from '../semesters/entities/semester.entity.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/** Gathers the platform-wide data the admin reports page needs. */
@Injectable()
export class ReportsService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Semester)
    private readonly semestersRepository: Repository<Semester>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(Grade)
    private readonly gradesRepository: Repository<Grade>,
  ) {}

  /** Returns every user, semester, subject and grade of the platform; the admin aggregates them. */
  public async getPlatformReport(): Promise<PlatformReport> {
    const [users, semesters, subjects, grades] = await Promise.all([
      this.usersRepository.find(),
      this.semestersRepository.find(),
      this.subjectsRepository.find(),
      this.gradesRepository.find(),
    ]);

    return { grades, semesters, subjects, users };
  }
}
