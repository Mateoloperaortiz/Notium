import type { Subject } from '@/models'
import { BaseRepository } from './base.repository'

class SubjectRepository extends BaseRepository<Subject> {
  constructor() {
    super('subjects')
  }

  listBySemester(semesterId: string): Subject[] {
    return this.findBy((subject) => subject.semesterId === semesterId)
  }

  codeExists(code: string, semesterId: string, exceptSubjectId?: string): boolean {
    const normalizedCode = code.trim().toLowerCase()
    return this.listBySemester(semesterId).some(
      (subject) =>
        subject.id !== exceptSubjectId && subject.code.trim().toLowerCase() === normalizedCode,
    )
  }

  countBySemester(semesterId: string, source?: readonly Subject[]): number {
    const items = source ?? this.listBySemester(semesterId)
    return items.filter((subject) => subject.semesterId === semesterId).length
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
