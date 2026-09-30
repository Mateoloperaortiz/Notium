/** Turns anything a service throws into a message the views can show. */
export class ErrorUtil {
  /** Message of an Error, or a generic Spanish message for anything else. */
  public static getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
