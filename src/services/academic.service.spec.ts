import { describe, expect, it } from 'vitest'

import { GradeType, SemesterStatus } from '@/models'
import type { Grade, Semester, Subject } from '@/models'
import {
  SubjectStatus,
  cumulativeAverage,
  evaluateSemester,
  evaluateSubject,
  weightedAverage,
} from './academic.service'

const TIMESTAMPS = { createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' }

function makeSubject(id: string, credits: number, semesterId = 'sem-1'): Subject {
  return {
    id,
    code: id.toUpperCase(),
    name: `Materia ${id}`,
    credits,
    professor: 'Docente de prueba',
    semesterId,
    ...TIMESTAMPS,
  }
}

function makeGrade(subjectId: string, value: number, percentage: number, id: string): Grade {
  return {
    id,
    title: 'Evaluacion',
    value,
    percentage,
    type: GradeType.Partial,
    date: '2025-03-15',
    subjectId,
    ...TIMESTAMPS,
  }
}

function makeSemester(id: string, userId = 'user-1'): Semester {
  return {
    id,
    name: `Semestre ${id}`,
    year: 2025,
    period: 1,
    status: SemesterStatus.InProgress,
    userId,
    ...TIMESTAMPS,
  }
}

describe('weightedAverage', () => {
  it('pondera por el peso de cada entrada', () => {
    expect(
      weightedAverage([
        { value: 4, weight: 3 },
        { value: 3, weight: 1 },
      ]),
    ).toBe(3.75)
  })

  it('devuelve 0 cuando no hay pesos', () => {
    expect(weightedAverage([])).toBe(0)
    expect(weightedAverage([{ value: 5, weight: 0 }])).toBe(0)
  })
})

describe('evaluateSubject', () => {
  it('acumula la nota ponderada y calcula el porcentaje pendiente', () => {
    const subject = makeSubject('math', 4)
    const grades = [makeGrade('math', 4, 25, 'g1'), makeGrade('math', 3, 25, 'g2')]

    const performance = evaluateSubject(subject, grades)

    expect(performance.accumulated).toBe(1.75)
    expect(performance.coveredPercentage).toBe(50)
    expect(performance.pendingPercentage).toBe(50)
    expect(performance.projectedFinal).toBe(3.5)
  })

  it('ignora las notas de otras materias', () => {
    const subject = makeSubject('math', 4)
    const grades = [makeGrade('math', 5, 40, 'g1'), makeGrade('otra', 1, 60, 'g2')]

    expect(evaluateSubject(subject, grades).coveredPercentage).toBe(40)
  })

  it('calcula cuanto necesita en el porcentaje pendiente para aprobar', () => {
    const subject = makeSubject('algo', 3)
    // 1.0 acumulado sobre el 50 % evaluado: necesita 4.0 en el 50 % restante.
    const performance = evaluateSubject(subject, [makeGrade('algo', 2, 50, 'g1')])

    expect(performance.requiredToPass).toBe(4)
    expect(performance.isPassImpossible).toBe(false)
    expect(performance.status).toBe(SubjectStatus.AtRisk)
  })

  it('marca la materia como reprobada cuando la nota requerida supera la escala', () => {
    const subject = makeSubject('fisica', 3)
    const performance = evaluateSubject(subject, [makeGrade('fisica', 1, 80, 'g1')])

    expect(performance.isPassImpossible).toBe(true)
    expect(performance.status).toBe(SubjectStatus.Failed)
  })

  it('marca la materia como aprobada cuando el acumulado ya supera la nota minima', () => {
    const subject = makeSubject('web', 4)
    const performance = evaluateSubject(subject, [makeGrade('web', 4.5, 70, 'g1')])

    expect(performance.requiredToPass).toBeLessThanOrEqual(0)
    expect(performance.status).toBe(SubjectStatus.Passed)
  })

  it('cierra la materia con el 100 % evaluado', () => {
    const subject = makeSubject('etica', 2)
    const grades = [makeGrade('etica', 2.5, 50, 'g1'), makeGrade('etica', 3.0, 50, 'g2')]
    const performance = evaluateSubject(subject, grades)

    expect(performance.requiredToPass).toBeNull()
    expect(performance.accumulated).toBe(2.75)
    expect(performance.status).toBe(SubjectStatus.Failed)
  })

  it('reporta las materias sin notas', () => {
    const performance = evaluateSubject(makeSubject('nueva', 3), [])

    expect(performance.status).toBe(SubjectStatus.NotStarted)
    expect(performance.projectedFinal).toBe(0)
  })
})

describe('evaluateSemester', () => {
  it('promedia las materias ponderando por creditos y excluye las que no tienen notas', () => {
    const semester = makeSemester('sem-1')
    const subjects = [makeSubject('a', 4), makeSubject('b', 2), makeSubject('c', 3)]
    const grades = [
      makeGrade('a', 4, 100, 'g1'),
      makeGrade('b', 3, 100, 'g2'),
      // La materia "c" no tiene notas y no debe afectar el promedio.
    ]

    const performance = evaluateSemester(semester, subjects, grades)

    expect(performance.average).toBe(3.67)
    expect(performance.totalCredits).toBe(9)
    expect(performance.evaluatedCredits).toBe(6)
    expect(performance.subjectCount).toBe(3)
  })

  it('cuenta las materias en riesgo o reprobadas', () => {
    const semester = makeSemester('sem-1')
    const subjects = [makeSubject('a', 3), makeSubject('b', 3)]
    const grades = [makeGrade('a', 4.5, 100, 'g1'), makeGrade('b', 1, 90, 'g2')]

    expect(evaluateSemester(semester, subjects, grades).atRiskCount).toBe(1)
  })
})

describe('cumulativeAverage', () => {
  it('pondera cada semestre por sus creditos evaluados', () => {
    const semesters = [makeSemester('sem-1'), makeSemester('sem-2')]
    const subjects = [makeSubject('a', 4, 'sem-1'), makeSubject('b', 2, 'sem-2')]
    const grades = [makeGrade('a', 5, 100, 'g1'), makeGrade('b', 2, 100, 'g2')]

    expect(cumulativeAverage(semesters, subjects, grades)).toBe(4)
  })

  it('devuelve 0 cuando todavia no hay notas', () => {
    expect(cumulativeAverage([makeSemester('sem-1')], [makeSubject('a', 3)], [])).toBe(0)
  })
})
