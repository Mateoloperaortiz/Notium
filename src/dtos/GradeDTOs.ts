import type { GradeInterface } from '@/interfaces/GradeInterface.js';

type GradeManagedFields = 'createdAt' | 'id' | 'subject' | 'updatetAt';

export type CreateGradeDTO = Omit<GradeInterface, GradeManagedFields>;

export type UpdateGradeDTO = Partial<CreateGradeDTO>;
