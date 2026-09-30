import type { GradeInterface } from '@/interfaces/GradeInterface.js';

/** Fields the service assigns, so the form never sends them. */
type GradeManagedFields = 'createdAt' | 'id' | 'subjectId' | 'updatedAt';

/** Fields filled in the grade form; the service adds the managed ones. */
export type CreateGradeDTO = Omit<GradeInterface, GradeManagedFields>;

/** Changes to a grade; missing fields keep their current value. */
export type UpdateGradeDTO = Partial<CreateGradeDTO>;

/** One message per field; an empty string means the field is valid. */
export interface GradeValidationErrorsDTO {
  date: string;
  percentage: string;
  title: string;
  type: string;
  value: string;
}
