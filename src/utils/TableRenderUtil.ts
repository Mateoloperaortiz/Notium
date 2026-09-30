export class TableRenderUtil {
  public static escapeHtml(value: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '<': '&lt;',
      '>': '&gt;',
    };

    return value.replace(
      /[&"'<>]/g,
      (character: string): string => htmlEscapes[character] ?? character,
    );
  }

  public static renderText(value: unknown): string {
    return TableRenderUtil.escapeHtml(String(value ?? ''));
  }
}
