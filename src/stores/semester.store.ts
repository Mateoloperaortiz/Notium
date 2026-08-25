import { defineStore } from 'pinia'

import type { Semester } from '@/models'
import type { CreateSemesterDTO, UpdateSemesterDTO } from '@/dto/CreateSemesterDTO'
import { semesterRepository, subjectRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'
import { validateSemesterInput } from '@/utils/dataValidators.utils'
import { useSubjectStore } from './subject.store'

export type SemesterMutationResult = { ok: true; semester: Semester } | { ok: false; error: string }

interface SemesterStore extends EntityCollection<Semester> {
  listByUser: (userId: string) => Semester[]
  countInProgressByUser: (userId: string) => number
  countCompletedByUser: (userId: string) => number
  countSubjectsBySemester: (semesterId: string) => number
  createSemester: (input: CreateSemesterDTO) => SemesterMutationResult
  updateSemester: (semesterId: string, input: UpdateSemesterDTO) => SemesterMutationResult
  removeSemester: (semesterId: string) => boolean
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

  function countInProgressByUser(userId: string): number {
    return semesterRepository.countInProgressByUser(userId, collection.items.value)
  }

  function countCompletedByUser(userId: string): number {
    return semesterRepository.countCompletedByUser(userId, collection.items.value)
  }

  function countSubjectsBySemester(semesterId: string): number {
    return subjectRepository.countBySemester(semesterId, subjectStore.items)
  }

  function createSemester(input: CreateSemesterDTO): SemesterMutationResult {
    const validationError = validateSemesterInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    const alreadyExists = listByUser(input.userId).some(
      (semester) => semester.year === input.year && semester.period === input.period,
    )
    if (alreadyExists) {
      return { ok: false, error: 'Ya existe un semestre para ese año y periodo.' }
    }

    const newSemester: CreateSemesterDTO = {
      name: input.name.trim(),
      year: input.year,
      period: input.period,
      status: input.status,
      userId: input.userId,
    }

    const created = collection.create(newSemester)

    return { ok: true, semester: created }
  }

  function updateSemester(semesterId: string, input: UpdateSemesterDTO): SemesterMutationResult {
    const current = collection.findById(semesterId)
    if (current === null) {
      return { ok: false, error: 'El semestre ya no existe.' }
    }

    const validationError = validateSemesterInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    const duplicateForUser = listByUser(current.userId).some(
      (semester) =>
        semester.id !== semesterId &&
        semester.year === input.year &&
        semester.period === input.period,
    )
    if (duplicateForUser) {
      return { ok: false, error: 'Ya existe otro semestre para ese ano y periodo.' }
    }

    const updatedSemester: UpdateSemesterDTO = {
      name: input.name.trim(),
      year: input.year,
      period: input.period,
      status: input.status,
    }

    const updated = collection.update(semesterId, updatedSemester)

    if (updated === null) {
      return { ok: false, error: 'No se pudo actualizar el semestre.' }
    }

    return { ok: true, semester: updated }
  }

  function removeSemester(semesterId: string): boolean {
    return removeWithChildren(semesterId)
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

  return {
    ...collection,
    listByUser,
    countInProgressByUser,
    countCompletedByUser,
    countSubjectsBySemester,
    createSemester,
    updateSemester,
    removeSemester,
    removeWithChildren,
    removeByUser,
  }
})
