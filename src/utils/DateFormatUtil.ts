export default class DateFormatUtil {
  private constructor() {}

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

  public static formatRange(startDate: string, endDate: string): string {
    return `${DateFormatUtil.formatDate(startDate)} – ${DateFormatUtil.formatDate(endDate)}`;
  }
}
