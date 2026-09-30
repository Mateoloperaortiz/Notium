/** Filters chosen on the analytics page; an undefined field means "all". */
export interface AnalyticsFilterDTO {
  semesterId?: number;
  type?: string;
}

/** One point of the grade evolution chart. */
export interface EvolutionPointDTO {
  label: string;
  value: number;
}

/** One row of the semester comparison table. */
export interface SemesterComparisonRowDTO {
  /** Null when the semester has no grades. */
  averageGrade: number | null;
  gradeCount: number;
  semesterId: number;
  semesterLabel: string;
  subjectCount: number;
}

/** One option of the semester selector. */
export interface SemesterOptionDTO {
  id: number;
  label: string;
}

/** Average grade of one assessment type. */
export interface TypeAverageDTO {
  average: number;
  type: string;
}
