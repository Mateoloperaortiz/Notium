import type { StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { Role } from '@/interfaces/UserInterface.js';

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
