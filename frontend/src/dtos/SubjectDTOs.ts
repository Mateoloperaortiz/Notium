import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';

/** Fields the service assigns, so the form never sends them. */
type SubjectManagedFields = 'createdAt' | 'id' | 'semesterId' | 'updatedAt';

/** Fields filled in the subject form; the service adds the managed ones. */
export type CreateSubjectDTO = Omit<SubjectInterface, SubjectManagedFields>;

/** Changes to a subject; missing fields keep their current value. */
export type UpdateSubjectDTO = Partial<CreateSubjectDTO>;

/** One message per field; an empty string means the field is valid. */
export interface SubjectValidationErrorsDTO {
  code: string;
  credits: string;
  name: string;
  professor: string;
}
