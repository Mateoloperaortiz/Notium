/** Changes to a grade; missing fields keep their current value. */
export class UpdateGradeDto {
  public subjectId?: number;

  public title?: string;

  public value?: number;

  public percentage?: number;

  public type?: string;

  public date?: string;
}
