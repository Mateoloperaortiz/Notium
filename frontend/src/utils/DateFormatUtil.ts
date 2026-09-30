/** Date helpers shared by forms, cards and tables. */
export class DateFormatUtil {
  /** Long Spanish date in UTC so the day never shifts; invalid input is returned as is. */
  public static formatDate(isoDate: string): string {
    const normalizedDate = isoDate.slice(0, 10);
    const date = new Date(`${normalizedDate}T00:00:00Z`);

    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalizedDate) {
      return isoDate;
    }

    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
      year: 'numeric',
    }).format(date);
  }

  /** Today's local date as YYYY-MM-DD, the default date of the grade form. */
  public static getTodayIsoDate(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
  }
}
