/** Fields the subject form sends; semesterId must be a semester the user owns. */
export class CreateSubjectDto {
  public semesterId: number;

  public code: string;

  public name: string;

  public credits: number;

  public professor: string;
}
