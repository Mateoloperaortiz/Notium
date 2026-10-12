/** Fields the grade form sends; subjectId must be a subject the user owns. */
export class CreateGradeDto {
  public subjectId: number;

  public title: string;

  public value: number;

  public percentage: number;

  public type: string;

  public date: string;
}
