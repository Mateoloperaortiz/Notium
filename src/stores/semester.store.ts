import { defineStore } from 'pinia'

import type { Semester } from '@/models'
import { semesterRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'
import { useSubjectStore } from './subject.store'

interface SemesterStore extends EntityCollection<Semester> {
  listByUser: (userId: string) => Semester[]
  /** Elimina el semestre junto con sus materias y notas. */
  removeWithChildren: (semesterId: string) => boolean
  removeByUser: (userId: string) => number
}

/** Orden natural de la carrera: primero el semestre mas reciente. */
function byMostRecent(left: Semester, right: Semester): number {
  return right.year - left.year || right.period - left.period
}

export const useSemesterStore = defineStore('semesters', (): SemesterStore => {
  const collection = useEntityCollection(semesterRepository)
  const subjectStore = useSubjectStore()

  function listByUser(userId: string): Semester[] {
    return collection.items.value
      .filter((semester) => semester.userId === userId)
      .sort(byMostRecent)
  }

  function removeWithChildren(semesterId: string): boolean {
    subjectStore.removeBySemesters([semesterId])
    return collection.remove(semesterId)
  }

  function removeByUser(userId: string): number {
    const semesterIds = listByUser(userId).map((semester) => semester.id)
    subjectStore.removeBySemesters(semesterIds)
    return collection.removeWhere((semester) => semester.userId === userId)
  }

  return { ...collection, listByUser, removeWithChildren, removeByUser }
})
