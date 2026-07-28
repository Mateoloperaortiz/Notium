import type { Semester } from '@/models'
import { BaseRepository } from './base.repository'

class SemesterRepository extends BaseRepository<Semester> {
  constructor() {
    super('semesters')
  }

  listByUser(userId: string): Semester[] {
    return this.findBy((semester) => semester.userId === userId)
  }

  removeByUser(userId: string): number {
    return this.removeWhere((semester) => semester.userId === userId)
  }
}

export const semesterRepository = new SemesterRepository()
