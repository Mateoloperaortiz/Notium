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
  /** Creation time as a Unix timestamp in milliseconds. */
  createdAt: number;
  /** Last update time as a Unix timestamp in milliseconds. */
  updatedAt: number;
}
