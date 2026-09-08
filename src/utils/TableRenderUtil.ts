const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
};

export default class TableRenderUtil {
  private constructor() {}

  public static escapeHtml(value: string): string {
    return value.replace(
      /[&"'<>]/g,
      (character: string): string => HTML_ESCAPES[character] ?? character,
    );
  }

  public static renderText(value: unknown): string {
    return TableRenderUtil.escapeHtml(String(value ?? ''));
  }
}
