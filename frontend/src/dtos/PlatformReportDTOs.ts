import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import type { Role, UserInterface } from '@/interfaces/UserInterface.js';

/** Raw platform data from GET /api/reports/platform; PlatformReportUtil aggregates it. */
export interface PlatformReportDTO {
  users: UserInterface[];
  semesters: SemesterInterface[];
  subjects: SubjectInterface[];
  grades: GradeInterface[];
}

/** Filters chosen on the admin reports page; an undefined field means "all". */
export interface PlatformReportFilterDTO {
  period?: number;
  year?: number;
}

/** One row of the users table on the admin reports page. */
export interface UserSummaryDTO {
  /** Null when the user has no grades in the filtered semesters. */
  averageGrade: number | null;
  email: string;
  id: number;
  name: string;
  role: Role;
  semesterCount: number;
  subjectCount: number;
}

/** Number of semesters in one status, for the status chart. */
export interface SemesterStatusCountDTO {
  count: number;
  status: StatusSemester;
}
