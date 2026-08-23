import type { SemesterStatus } from '@/models'

export interface CreateSemesterDTO {
  name: string
  year: number
  /** Periodo academico permitido: 1 o 2. */
  period: number
  status: SemesterStatus
  userId: string
}

/** Al editar no se cambia el propietario del semestre. */
export type UpdateSemesterDTO = Omit<CreateSemesterDTO, 'userId'>
