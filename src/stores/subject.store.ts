import { defineStore } from 'pinia'

import type { Subject } from '@/models'
import type { CreateSubjectDTO, UpdateSubjectDTO } from '@/dto/CreateSubjectDTO'
import { semesterRepository, subjectRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'
import { validateSubjectInput } from '@/utils/dataValidators.utils'
import { useGradeStore } from './grade.store'

export type SubjectMutationResult = { ok: true; subject: Subject } | { ok: false; error: string }

interface SubjectStore extends EntityCollection<Subject> {
  listBySemester: (semesterId: string) => Subject[]
  listBySemesters: (semesterIds: readonly string[]) => Subject[]
  createSubject: (input: CreateSubjectDTO) => SubjectMutationResult
  updateSubject: (subjectId: string, input: UpdateSubjectDTO) => SubjectMutationResult
  removeSubject: (subjectId: string) => boolean
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

  function createSubject(input: CreateSubjectDTO): SubjectMutationResult {
    const validationError = validateSubjectInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    if (semesterRepository.findById(input.semesterId) === null) {
      return { ok: false, error: 'El semestre seleccionado no existe.' }
    }

    if (subjectRepository.codeExists(input.code, input.semesterId)) {
      return { ok: false, error: 'Ya existe una materia con ese codigo en el semestre.' }
    }

    const newSubject: CreateSubjectDTO = {
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      credits: input.credits,
      professor: input.professor.trim(),
      semesterId: input.semesterId,
    }

    const created = collection.create(newSubject)

    return { ok: true, subject: created }
  }

  function updateSubject(subjectId: string, input: UpdateSubjectDTO): SubjectMutationResult {
    const current = collection.findById(subjectId)
    if (current === null) {
      return { ok: false, error: 'La materia ya no existe.' }
    }

    const validationError = validateSubjectInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    if (semesterRepository.findById(input.semesterId) === null) {
      return { ok: false, error: 'El semestre seleccionado no existe.' }
    }

    if (subjectRepository.codeExists(input.code, input.semesterId, subjectId)) {
      return { ok: false, error: 'Ya existe otra materia con ese codigo en el semestre.' }
    }

    const updatedSubject: UpdateSubjectDTO = {
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      credits: input.credits,
      professor: input.professor.trim(),
      semesterId: input.semesterId,
    }

    const updated = collection.update(subjectId, updatedSubject)

    if (updated === null) {
      return { ok: false, error: 'No se pudo actualizar la materia.' }
    }

    return { ok: true, subject: updated }
  }

  function removeSubject(subjectId: string): boolean {
    return removeWithGrades(subjectId)
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

  return {
    ...collection,
    listBySemester,
    listBySemesters,
    createSubject,
    updateSubject,
    removeSubject,
    removeWithGrades,
    removeBySemesters,
  }
})
