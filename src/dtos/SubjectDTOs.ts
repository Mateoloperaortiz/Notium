import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';

type SubjectManagedFields = 'createdAt' | 'grades' | 'id' | 'semester' | 'updatedAt';

export type CreateSubjectDTO = Omit<SubjectInterface, SubjectManagedFields>;

export type UpdateSubjectDTO = Partial<CreateSubjectDTO>;

export interface SubjectValidationErrorsDTO {
  code: string;
  credits: string;
  name: string;
  professor: string;
}
