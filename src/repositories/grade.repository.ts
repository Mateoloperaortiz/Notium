import type { Grade } from '@/models'
import { BaseRepository } from './base.repository'

class GradeRepository extends BaseRepository<Grade> {
  constructor() {
    super('grades')
  }

  listBySubject(subjectId: string): Grade[] {
    return this.findBy((grade) => grade.subjectId === subjectId)
  }

  listBySubjects(subjectIds: readonly string[]): Grade[] {
    const ids = new Set(subjectIds)
    return this.findBy((grade) => ids.has(grade.subjectId))
  }

  removeBySubjects(subjectIds: readonly string[]): number {
    const ids = new Set(subjectIds)
    return this.removeWhere((grade) => ids.has(grade.subjectId))
  }
}

export const gradeRepository = new GradeRepository()
