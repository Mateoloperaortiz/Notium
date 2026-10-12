/** A course the student takes during one semester. */
export interface SubjectInterface {
  id: number;
  /** Semester this subject belongs to. */
  semesterId: number;
  code: string;
  name: string;
  /** Academic credits, a positive integer. */
  credits: number;
  professor: string;
  /** Creation time as an ISO date string. */
  createdAt: string;
  /** Last update time as an ISO date string. */
  updatedAt: string;
}
