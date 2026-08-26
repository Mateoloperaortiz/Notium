import { defineStore } from 'pinia'

import type { Grade } from '@/models'
import type { CreateGradeDTO, UpdateGradeDTO } from '@/dto/CreateGradeDTO'
import { gradeRepository } from '@/repositories'
import { subjectRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import type { EntityCollection } from '@/composables/useEntityCollection'
import { validateGradeInput } from '@/utils/dataValidators.utils'

export type GradeMutationResult = { ok: true; grade: Grade } | { ok: false; error: string }

interface GradeStore extends EntityCollection<Grade> {
  listBySubject: (subjectId: string) => Grade[]
  listBySubjects: (subjectIds: readonly string[]) => Grade[]
  createGrade: (input: CreateGradeDTO) => GradeMutationResult
  updateGrade: (gradeId: string, input: UpdateGradeDTO) => GradeMutationResult
  removeGrade: (gradeId: string) => boolean
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

  function createGrade(input: CreateGradeDTO): GradeMutationResult {
    const validationError = validateGradeInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    if (subjectRepository.findById(input.subjectId) === null) {
      return { ok: false, error: 'La materia seleccionada no existe.' }
    }

    const nextUsedPercentage = usedPercentage(input.subjectId) + input.percentage
    if (nextUsedPercentage > 100) {
      return { ok: false, error: 'El porcentaje acumulado de la materia no puede superar 100 %.' }
    }

    const newGrade: CreateGradeDTO = {
      title: input.title.trim(),
      value: input.value,
      percentage: input.percentage,
      type: input.type,
      date: input.date,
      subjectId: input.subjectId,
    }

    const created = collection.create(newGrade)
    return { ok: true, grade: created }
  }

  function updateGrade(gradeId: string, input: UpdateGradeDTO): GradeMutationResult {
    const current = collection.findById(gradeId)
    if (current === null) {
      return { ok: false, error: 'La nota ya no existe.' }
    }

    const validationError = validateGradeInput(input)
    if (validationError !== null) {
      return { ok: false, error: validationError }
    }

    if (subjectRepository.findById(input.subjectId) === null) {
      return { ok: false, error: 'La materia seleccionada no existe.' }
    }

    const nextUsedPercentage = usedPercentage(input.subjectId, gradeId) + input.percentage
    if (nextUsedPercentage > 100) {
      return { ok: false, error: 'El porcentaje acumulado de la materia no puede superar 100 %.' }
    }

    const updatedGrade: UpdateGradeDTO = {
      title: input.title.trim(),
      value: input.value,
      percentage: input.percentage,
      type: input.type,
      date: input.date,
      subjectId: input.subjectId,
    }

    const updated = collection.update(gradeId, updatedGrade)
    if (updated === null) {
      return { ok: false, error: 'No se pudo actualizar la nota.' }
    }

    return { ok: true, grade: updated }
  }

  function removeGrade(gradeId: string): boolean {
    return collection.remove(gradeId)
  }

  function usedPercentage(subjectId: string, exceptGradeId?: string): number {
    return listBySubject(subjectId)
      .filter((grade) => grade.id !== exceptGradeId)
      .reduce((sum, grade) => sum + grade.percentage, 0)
  }

  return {
    ...collection,
    listBySubject,
    listBySubjects,
    createGrade,
    updateGrade,
    removeGrade,
    removeBySubjects,
    usedPercentage,
  }
})
