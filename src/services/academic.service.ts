import { env } from '@/config/env'
import type { Grade, Semester, Subject } from '@/models'
import { clamp, round } from '@/utils/format.util'

export const SubjectStatus = {
  NotStarted: 'not_started',
  OnTrack: 'on_track',
  AtRisk: 'at_risk',
  Passed: 'passed',
  Failed: 'failed',
} as const

export type SubjectStatus = (typeof SubjectStatus)[keyof typeof SubjectStatus]

export interface SubjectPerformance {
  subjectId: string
  /** Suma de nota x porcentaje de las evaluaciones ya registradas. */
  accumulated: number
  /** Porcentaje del curso que ya fue evaluado. */
  coveredPercentage: number
  pendingPercentage: number
  /** Nota final estimada si el estudiante mantiene su desempeno actual. */
  projectedFinal: number
  /**
   * Nota promedio que necesita en el porcentaje pendiente para aprobar.
   * `null` cuando ya no queda porcentaje por evaluar.
   */
  requiredToPass: number | null
  /** `true` cuando la nota requerida supera la escala maxima. */
  isPassImpossible: boolean
  status: SubjectStatus
}

export interface SemesterPerformance {
  semesterId: string
  /** Promedio ponderado por creditos de las materias con notas registradas. */
  average: number
  totalCredits: number
  evaluatedCredits: number
  subjectCount: number
  atRiskCount: number
}

interface WeightedEntry {
  value: number
  weight: number
}

export function subjectStatusLabel(status: SubjectStatus): string {
  switch (status) {
    case SubjectStatus.NotStarted:
      return 'Sin notas'
    case SubjectStatus.OnTrack:
      return 'Al dia'
    case SubjectStatus.AtRisk:
      return 'En riesgo'
    case SubjectStatus.Passed:
      return 'Aprobada'
    case SubjectStatus.Failed:
      return 'Reprobada'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

export function subjectStatusTone(
  status: SubjectStatus,
): 'neutral' | 'info' | 'warning' | 'success' | 'danger' {
  switch (status) {
    case SubjectStatus.NotStarted:
      return 'neutral'
    case SubjectStatus.OnTrack:
      return 'info'
    case SubjectStatus.AtRisk:
      return 'warning'
    case SubjectStatus.Passed:
      return 'success'
    case SubjectStatus.Failed:
      return 'danger'
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

/** Promedio ponderado generico; devuelve 0 cuando no hay pesos. */
export function weightedAverage(entries: readonly WeightedEntry[]): number {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (totalWeight <= 0) {
    return 0
  }

  const totalValue = entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0)
  return round(totalValue / totalWeight)
}

/** Aporte de una evaluacion a la nota final de la materia. */
export function gradeContribution(grade: Grade): number {
  return round((grade.value * grade.percentage) / 100)
}

export function evaluateSubject(subject: Subject, grades: readonly Grade[]): SubjectPerformance {
  const own = grades.filter((grade) => grade.subjectId === subject.id)
  const coveredPercentage = round(own.reduce((sum, grade) => sum + grade.percentage, 0))
  const accumulated = round(
    own.reduce((sum, grade) => sum + (grade.value * grade.percentage) / 100, 0),
  )
  const pendingPercentage = round(Math.max(0, 100 - coveredPercentage))

  const projectedFinal = coveredPercentage > 0 ? round((accumulated / coveredPercentage) * 100) : 0

  const requiredToPass =
    pendingPercentage > 0
      ? round(((env.passingGrade - accumulated) / pendingPercentage) * 100)
      : null

  const isPassImpossible = requiredToPass !== null && requiredToPass > env.maxGrade

  return {
    subjectId: subject.id,
    accumulated,
    coveredPercentage,
    pendingPercentage,
    projectedFinal,
    requiredToPass,
    isPassImpossible,
    status: resolveSubjectStatus({
      coveredPercentage,
      pendingPercentage,
      accumulated,
      requiredToPass,
      isPassImpossible,
    }),
  }
}

function resolveSubjectStatus(input: {
  coveredPercentage: number
  pendingPercentage: number
  accumulated: number
  requiredToPass: number | null
  isPassImpossible: boolean
}): SubjectStatus {
  if (input.coveredPercentage === 0) {
    return SubjectStatus.NotStarted
  }

  if (input.pendingPercentage === 0 || input.requiredToPass === null) {
    return input.accumulated >= env.passingGrade ? SubjectStatus.Passed : SubjectStatus.Failed
  }

  if (input.requiredToPass <= 0) {
    return SubjectStatus.Passed
  }

  if (input.isPassImpossible) {
    return SubjectStatus.Failed
  }

  return input.requiredToPass > env.passingGrade ? SubjectStatus.AtRisk : SubjectStatus.OnTrack
}

export function evaluateSemester(
  semester: Semester,
  subjects: readonly Subject[],
  grades: readonly Grade[],
): SemesterPerformance {
  const own = subjects.filter((subject) => subject.semesterId === semester.id)
  const performances = own.map((subject) => ({
    subject,
    performance: evaluateSubject(subject, grades),
  }))

  const evaluated = performances.filter((item) => item.performance.coveredPercentage > 0)

  return {
    semesterId: semester.id,
    average: weightedAverage(
      evaluated.map((item) => ({
        value: item.performance.projectedFinal,
        weight: item.subject.credits,
      })),
    ),
    totalCredits: own.reduce((sum, subject) => sum + subject.credits, 0),
    evaluatedCredits: evaluated.reduce((sum, item) => sum + item.subject.credits, 0),
    subjectCount: own.length,
    atRiskCount: performances.filter(
      (item) =>
        item.performance.status === SubjectStatus.AtRisk ||
        item.performance.status === SubjectStatus.Failed,
    ).length,
  }
}

/** Promedio acumulado de la carrera, ponderado por los creditos ya evaluados. */
export function cumulativeAverage(
  semesters: readonly Semester[],
  subjects: readonly Subject[],
  grades: readonly Grade[],
): number {
  const performances = semesters.map((semester) => evaluateSemester(semester, subjects, grades))
  return weightedAverage(
    performances.map((performance) => ({
      value: performance.average,
      weight: performance.evaluatedCredits,
    })),
  )
}

/** Progreso de la materia sobre 100 %, listo para una barra de avance. */
export function coverageRatio(performance: SubjectPerformance): number {
  return clamp(performance.coveredPercentage, 0, 100)
}
