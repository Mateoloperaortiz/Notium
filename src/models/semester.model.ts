import type { BaseEntity, SelectOption } from './base.model'

export const SemesterStatus = {
  Planned: 'planned',
  InProgress: 'in_progress',
  Completed: 'completed',
} as const

export type SemesterStatus = (typeof SemesterStatus)[keyof typeof SemesterStatus]

export interface Semester extends BaseEntity {
  name: string
  year: number
  /** Periodo academico dentro del ano: 1 o 2. */
  period: number
  status: SemesterStatus
  /** Relacion User "1" --> "1..*" Semester. */
  userId: string
}

export function semesterStatusLabel(status: SemesterStatus): string {
  switch (status) {
    case SemesterStatus.Planned:
      return 'Planeado'
    case SemesterStatus.InProgress:
      return 'En curso'
    case SemesterStatus.Completed:
      return 'Finalizado'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

export function semesterStatusTone(status: SemesterStatus): 'neutral' | 'info' | 'success' {
  switch (status) {
    case SemesterStatus.Planned:
      return 'neutral'
    case SemesterStatus.InProgress:
      return 'info'
    case SemesterStatus.Completed:
      return 'success'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

export const SEMESTER_STATUS_OPTIONS: readonly SelectOption<SemesterStatus>[] = Object.values(
  SemesterStatus,
).map((status) => ({ value: status, label: semesterStatusLabel(status) }))

export const SEMESTER_PERIOD_OPTIONS: readonly SelectOption<string>[] = [
  { value: '1', label: 'Periodo 1' },
  { value: '2', label: 'Periodo 2' },
]
