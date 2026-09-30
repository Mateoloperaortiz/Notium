export class IdUtil {
  public static getNextId(items: { id: number }[]): number {
    return Math.max(0, ...items.map((item: { id: number }): number => item.id)) + 1;
  }
}
