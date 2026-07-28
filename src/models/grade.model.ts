import type { BaseEntity, SelectOption } from './base.model'

export const GradeType = {
  Partial: 'partial',
  Homework: 'homework',
  Quiz: 'quiz',
  Project: 'project',
  Final: 'final',
  Other: 'other',
} as const

export type GradeType = (typeof GradeType)[keyof typeof GradeType]

export interface Grade extends BaseEntity {
  title: string
  /** Calificacion obtenida dentro de la escala institucional. */
  value: number
  /** Peso de la evaluacion sobre el 100 % de la materia. */
  percentage: number
  type: GradeType
  /** Fecha de la evaluacion en formato YYYY-MM-DD. */
  date: string
  /** Relacion Subject "1" --> "1..*" Grade. */
  subjectId: string
}

export function gradeTypeLabel(type: GradeType): string {
  switch (type) {
    case GradeType.Partial:
      return 'Parcial'
    case GradeType.Homework:
      return 'Trabajo'
    case GradeType.Quiz:
      return 'Quiz'
    case GradeType.Project:
      return 'Proyecto'
    case GradeType.Final:
      return 'Examen final'
    case GradeType.Other:
      return 'Otra'
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

export const GRADE_TYPE_OPTIONS: readonly SelectOption<GradeType>[] = Object.values(GradeType).map(
  (type) => ({ value: type, label: gradeTypeLabel(type) }),
)
