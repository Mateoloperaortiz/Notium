import type { Grade } from '../../grades/entities/grade.entity.js';
import type { Semester } from '../../semesters/entities/semester.entity.js';
import type { Subject } from '../../subjects/entities/subject.entity.js';
import type { User } from '../../users/entities/user.entity.js';

/** Raw platform data the admin reports page aggregates on the client. */
export interface PlatformReport {
  users: User[];
  semesters: Semester[];
  subjects: Subject[];
  grades: Grade[];
}
