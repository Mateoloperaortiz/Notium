import type { StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { Role } from '@/interfaces/UserInterface.js';

export interface PlatformReportFilterDTO {
  period?: number;
  year?: number;
}

export interface UserSummaryDTO {
  averageGrade: number | null;
  email: string;
  id: string;
  name: string;
  role: Role;
  semesterCount: number;
  subjectCount: number;
}

export interface SemesterStatusCountDTO {
  count: number;
  status: StatusSemester;
}
