import { defineStore } from 'pinia'

import type { Subject } from '@/models'
import { subjectRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'
import { useGradeStore } from './grade.store'

interface SubjectStore extends EntityCollection<Subject> {
  listBySemester: (semesterId: string) => Subject[]
  listBySemesters: (semesterIds: readonly string[]) => Subject[]
  /** Elimina la materia junto con todas sus notas. */
  removeWithGrades: (subjectId: string) => boolean
  removeBySemesters: (semesterIds: readonly string[]) => number
}

export const useSubjectStore = defineStore('subjects', (): SubjectStore => {
  const collection = useEntityCollection(subjectRepository)
  const gradeStore = useGradeStore()

  function listBySemester(semesterId: string): Subject[] {
    return collection.items.value.filter((subject) => subject.semesterId === semesterId)
  }

  function listBySemesters(semesterIds: readonly string[]): Subject[] {
    const ids = new Set(semesterIds)
    return collection.items.value.filter((subject) => ids.has(subject.semesterId))
  }

  function removeWithGrades(subjectId: string): boolean {
    gradeStore.removeBySubjects([subjectId])
    return collection.remove(subjectId)
  }

  function removeBySemesters(semesterIds: readonly string[]): number {
    const subjectIds = listBySemesters(semesterIds).map((subject) => subject.id)
    gradeStore.removeBySubjects(subjectIds)
    const ids = new Set(semesterIds)
    return collection.removeWhere((subject) => ids.has(subject.semesterId))
  }

  return { ...collection, listBySemester, listBySemesters, removeWithGrades, removeBySemesters }
})
