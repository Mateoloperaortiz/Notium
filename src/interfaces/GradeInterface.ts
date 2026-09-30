/** A grade the student got in one assessment of a subject. */
export interface GradeInterface {
  id: number;
  /** Subject this grade belongs to. */
  subjectId: number;
  title: string;
  /** Score on the 0 to 5 scale. */
  value: number;
  /** Weight of this grade in the subject, an integer from 1 to 100. */
  percentage: number;
  /** Free-text assessment type, such as "Parcial" or "Taller". */
  type: string;
  /** Assessment date as an ISO string (YYYY-MM-DD). */
  date: string;
  /** Creation time as a Unix timestamp in milliseconds. */
  createdAt: number;
  /** Last update time as a Unix timestamp in milliseconds. */
  updatedAt: number;
}
