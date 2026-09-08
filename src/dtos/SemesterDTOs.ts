import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';

type SemesterManagedFields = 'createdAt' | 'id' | 'subjects' | 'updatedAt' | 'user';

export type CreateSemesterDTO = Omit<SemesterInterface, SemesterManagedFields>;

export type UpdateSemesterDTO = Partial<CreateSemesterDTO>;

export interface SemesterValidationErrorsDTO {
  name: string;
  period: string;
  status: string;
  year: string;
}
