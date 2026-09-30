/** Numeric IDs without crypto.randomUUID(), which does not exist over plain HTTP. */
export class IdUtil {
  /** Highest existing ID plus one, or 1 for an empty list. */
  public static getNextId(items: { id: number }[]): number {
    return Math.max(0, ...items.map((item: { id: number }): number => item.id)) + 1;
  }
}
