import type { BaseEntity } from './base.model'

export interface Subject extends BaseEntity {
  code: string
  name: string
  credits: number
  professor: string
  /** Relacion Semester "1" --> "1..*" Subject. */
  semesterId: string
}
