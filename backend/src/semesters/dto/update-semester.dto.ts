import { StatusSemester } from '../enums/status-semester.enum.js';

/** Changes to a semester; missing fields keep their current value. */
export class UpdateSemesterDto {
  public name?: string;

  public year?: number;

  public period?: number;

  public status?: StatusSemester;
}
