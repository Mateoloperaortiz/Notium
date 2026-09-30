export interface AnalyticsFilterDTO {
  semesterId?: number;
  type?: string;
}

export interface EvolutionPointDTO {
  label: string;
  value: number;
}

export interface SemesterComparisonRowDTO {
  averageGrade: number | null;
  gradeCount: number;
  semesterId: number;
  semesterLabel: string;
  subjectCount: number;
}

export interface SemesterOptionDTO {
  id: number;
  label: string;
}

export interface TypeAverageDTO {
  average: number;
  type: string;
}
