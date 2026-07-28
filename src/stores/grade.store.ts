import { defineStore } from 'pinia'

import type { Grade } from '@/models'
import { gradeRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'

interface GradeStore extends EntityCollection<Grade> {
  listBySubject: (subjectId: string) => Grade[]
  listBySubjects: (subjectIds: readonly string[]) => Grade[]
  removeBySubjects: (subjectIds: readonly string[]) => number
  /** Porcentaje ya asignado a otras evaluaciones de la misma materia. */
  usedPercentage: (subjectId: string, exceptGradeId?: string) => number
}

export const useGradeStore = defineStore('grades', (): GradeStore => {
  const collection = useEntityCollection(gradeRepository)

  function listBySubject(subjectId: string): Grade[] {
    return collection.items.value.filter((grade) => grade.subjectId === subjectId)
  }

  function listBySubjects(subjectIds: readonly string[]): Grade[] {
    const ids = new Set(subjectIds)
    return collection.items.value.filter((grade) => ids.has(grade.subjectId))
  }

  function removeBySubjects(subjectIds: readonly string[]): number {
    const ids = new Set(subjectIds)
    return collection.removeWhere((grade) => ids.has(grade.subjectId))
  }

  function usedPercentage(subjectId: string, exceptGradeId?: string): number {
    return listBySubject(subjectId)
      .filter((grade) => grade.id !== exceptGradeId)
      .reduce((sum, grade) => sum + grade.percentage, 0)
  }

  return { ...collection, listBySubject, listBySubjects, removeBySubjects, usedPercentage }
})
