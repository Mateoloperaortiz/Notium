/** Lifecycle of a semester; the values are the labels shown in the UI. */
export enum StatusSemester {
  inComing = 'Entrante',
  inProgress = 'En proceso',
  ended = 'Terminado',
}

/** An academic period registered by a student. */
export interface SemesterInterface {
  id: number;
  /** Student who owns this semester. */
  userId: number;
  name: string;
  year: number;
  /** 1 for the first half of the year, 2 for the second. */
  period: number;
  status: StatusSemester;
  /** Creation time as a Unix timestamp in milliseconds. */
  createdAt: number;
  /** Last update time as a Unix timestamp in milliseconds. */
  updatedAt: number;
}
