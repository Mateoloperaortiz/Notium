import type { CreateSemesterDTO, UpdateSemesterDTO } from '@/dto/CreateSemesterDTO'
import { SemesterStatus } from '@/models'

type SemesterInput = CreateSemesterDTO | UpdateSemesterDTO

/** Devuelve el primer error de validacion del formulario de semestre, o null. */
export function validateSemesterInput(input: SemesterInput): string | null {
  if (input.name.trim() === '') {
    return 'El nombre del semestre es obligatorio.'
  }

  if (!Number.isInteger(input.year) || input.year < 1900 || input.year > 3000) {
    return 'El ano del semestre no es valido.'
  }

  if (input.period !== 1 && input.period !== 2) {
    return 'El periodo debe ser 1 o 2.'
  }

  if (!Object.values(SemesterStatus).includes(input.status)) {
    return 'El estado del semestre no es valido.'
  }

  if ('userId' in input && input.userId.trim() === '') {
    return 'El usuario del semestre es obligatorio.'
  }

  return null
}
