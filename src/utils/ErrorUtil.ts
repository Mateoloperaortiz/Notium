export class ErrorUtil {
  public static getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
