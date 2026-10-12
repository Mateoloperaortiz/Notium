import { StatusSemester } from '../enums/status-semester.enum.js';

/** Fields the semester form sends; the service adds the user and the managed ones. */
export class CreateSemesterDto {
  public name: string;

  public year: number;

  public period: number;

  public status: StatusSemester;
}
