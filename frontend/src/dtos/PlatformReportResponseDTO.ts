import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';

/** Raw platform data the admin reports page aggregates with PlatformReportUtil. */
export interface PlatformReportDTO {
  users: UserInterface[];
  semesters: SemesterInterface[];
  subjects: SubjectInterface[];
  grades: GradeInterface[];
}
