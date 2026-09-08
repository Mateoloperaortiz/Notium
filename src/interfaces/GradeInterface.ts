import type { SubjectInterface } from './SubjectInterface';

export interface GradeInterface {
  id: string;
  title: string;
  value: number;
  percentage: number;
  type: string;
  date: Date;
  createdAt: number;
  updatetAt: number;
  subject: SubjectInterface;
}
