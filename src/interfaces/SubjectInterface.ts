import type { GradeInterface } from './GradeInterface.js';
import type { SemesterInterface } from './SemesterInterface.js';

export interface SubjectInterface {
  id: string;
  code: string;
  name: string;
  credits: number;
  professor: string;
  createdAt: number;
  updatedAt: number;
  semester: SemesterInterface;
  grades: GradeInterface[];
}
