import type { UserInterface } from "./UserInterface.js";
import type { SubjectInterface } from "./SubjectInterface.js";

export enum StatusSemester {
  inComing = "Entrante",
  inProgress = "En proceso",
  ended = "Terminado"

}

export interface SemesterInterface {
    id: string;
    name: string;
    year: number;
    period: number;
    status: StatusSemester;
    createdAt: number;
    updatedAt: number;
    user: UserInterface;
    subjects: SubjectInterface[];
}