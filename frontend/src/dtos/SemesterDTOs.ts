import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';

/** Fields the service assigns, so the form never sends them. */
type SemesterManagedFields = 'createdAt' | 'id' | 'updatedAt' | 'userId';

/** Fields filled in the semester form; the service adds the managed ones. */
export type CreateSemesterDTO = Omit<SemesterInterface, SemesterManagedFields>;

/** Changes to a semester; missing fields keep their current value. */
export type UpdateSemesterDTO = Partial<CreateSemesterDTO>;

/** One message per field; an empty string means the field is valid. */
export interface SemesterValidationErrorsDTO {
  name: string;
  period: string;
  status: string;
  year: string;
}
