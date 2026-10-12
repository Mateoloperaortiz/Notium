/** Changes to a subject; missing fields keep their current value. */
export class UpdateSubjectDto {
  public semesterId?: number;

  public code?: string;

  public name?: string;

  public credits?: number;

  public professor?: string;
}
