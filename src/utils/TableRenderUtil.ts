import { Role } from '@/interfaces/UserInterface.js';

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

  public static renderAverage(average: number | null): string {
    return average === null ? '—' : average.toFixed(2);
  }

  public static renderRole(role: Role): string {
    return role === Role.Admin ? 'Administrador' : 'Estudiante';
  }
}
