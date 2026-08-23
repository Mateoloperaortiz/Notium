import { SemesterStatus } from '@/models'
import type { Semester } from '@/models'
import { BaseRepository } from './base.repository'

class SemesterRepository extends BaseRepository<Semester> {
  constructor() {
    super('semesters')
  }

  listByUser(userId: string): Semester[] {
    return this.findBy((semester) => semester.userId === userId)
  }

  countInProgressByUser(userId: string, source?: readonly Semester[]): number {
    const items = source ?? this.listByUser(userId)
    return items.filter(
      (semester) => semester.userId === userId && semester.status === SemesterStatus.InProgress,
    ).length
  }

  countCompletedByUser(userId: string, source?: readonly Semester[]): number {
    const items = source ?? this.listByUser(userId)
    return items.filter(
      (semester) => semester.userId === userId && semester.status === SemesterStatus.Completed,
    ).length
  }

  removeByUser(userId: string): number {
    return this.removeWhere((semester) => semester.userId === userId)
  }
}

export const semesterRepository = new SemesterRepository()
