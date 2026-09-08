import type { GradeInterface } from '@/interfaces/GradeInterface.js';

type GradeManagedFields = 'createdAt' | 'id' | 'subject' | 'updatetAt';

export type CreateGradeDTO = Omit<GradeInterface, GradeManagedFields>;

export type UpdateGradeDTO = Partial<CreateGradeDTO>;

export interface GradeValidationErrorsDTO {
  date: string;
  percentage: string;
  title: string;
  type: string;
  value: string;
}
