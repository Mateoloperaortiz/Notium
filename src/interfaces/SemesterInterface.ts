export enum StatusSemester {
  inComing = 'Entrante',
  inProgress = 'En proceso',
  ended = 'Terminado',
}

export interface SemesterInterface {
  id: number;
  userId: number;
  name: string;
  year: number;
  period: number;
  status: StatusSemester;
  createdAt: number;
  updatedAt: number;
}
