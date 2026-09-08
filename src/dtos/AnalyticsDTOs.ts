export interface AnalyticsFilterDTO {
  semesterId?: string;
  type?: string;
}

export interface EvolutionPointDTO {
  date: string;
  label: string;
  value: number;
}

export interface SemesterComparisonRowDTO {
  averageGrade: number | null;
  gradeCount: number;
  semesterId: string;
  semesterLabel: string;
  subjectCount: number;
}

export interface SemesterOptionDTO {
  id: string;
  label: string;
}

export interface TypeAverageDTO {
  average: number;
  type: string;
}
