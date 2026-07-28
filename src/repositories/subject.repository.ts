import type { Subject } from '@/models'
import { BaseRepository } from './base.repository'

class SubjectRepository extends BaseRepository<Subject> {
  constructor() {
    super('subjects')
  }

  listBySemester(semesterId: string): Subject[] {
    return this.findBy((subject) => subject.semesterId === semesterId)
  }

  listBySemesters(semesterIds: readonly string[]): Subject[] {
    const ids = new Set(semesterIds)
    return this.findBy((subject) => ids.has(subject.semesterId))
  }

  removeBySemesters(semesterIds: readonly string[]): number {
    const ids = new Set(semesterIds)
    return this.removeWhere((subject) => ids.has(subject.semesterId))
  }
}

export const subjectRepository = new SubjectRepository()
