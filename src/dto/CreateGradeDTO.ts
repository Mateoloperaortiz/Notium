import type { Grade } from '@/models'

export type CreateGradeDTO = Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateGradeDTO = CreateGradeDTO
