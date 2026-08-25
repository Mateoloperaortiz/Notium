import type { Subject } from '@/models'

export type CreateSubjectDTO = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSubjectDTO = CreateSubjectDTO
