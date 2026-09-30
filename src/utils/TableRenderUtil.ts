import { Role } from '@/interfaces/UserInterface.js';

/** Cell renderers for DataTables, which inserts what they return as HTML. */
export class TableRenderUtil {
  /** Escapes the characters that would let user text be read as HTML. */
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

  /** Escaped text for any value; null and undefined become an empty string. */
  public static renderText(value: unknown): string {
    return TableRenderUtil.escapeHtml(String(value ?? ''));
  }

  /** Average with two decimals, or a dash when there is none. */
  public static renderAverage(average: number | null): string {
    return average === null ? '—' : average.toFixed(2);
  }

  /** Spanish label of a role. */
  public static renderRole(role: Role): string {
    return role === Role.Admin ? 'Administrador' : 'Estudiante';
  }
}
