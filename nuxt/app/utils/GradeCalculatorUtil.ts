/** Calculates the average still needed in a course with grades from zero to five. */
export class GradeCalculatorUtil {
  /** Reads a decimal entry while accepting the comma commonly used in Spanish. */
  public static parseValue(value: string): number {
    const normalizedValue = value.trim().replace(',', '.');

    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalizedValue)) {
      return Number.NaN;
    }

    return Number(normalizedValue);
  }

  /** Explains the first invalid input before a calculation can be performed. */
  public static validateFields(
    currentAverage: string,
    evaluatedPercentage: string,
    targetGrade: string,
  ): string {
    if (!currentAverage.trim() || !evaluatedPercentage.trim() || !targetGrade.trim()) {
      return 'Completa los tres campos para calcular la nota que necesitas.';
    }

    const average = GradeCalculatorUtil.parseValue(currentAverage);
    const percentage = GradeCalculatorUtil.parseValue(evaluatedPercentage);
    const target = GradeCalculatorUtil.parseValue(targetGrade);

    return GradeCalculatorUtil.validateNumbers(average, percentage, target);
  }

  /** Returns zero when the earned contribution already guarantees the target. */
  public static getRequiredGrade(
    currentAverage: number,
    evaluatedPercentage: number,
    targetGrade: number,
  ): number {
    const errorMessage = GradeCalculatorUtil.validateNumbers(
      currentAverage,
      evaluatedPercentage,
      targetGrade,
    );

    if (errorMessage) {
      throw new RangeError(errorMessage);
    }

    const evaluatedWeight = evaluatedPercentage / 100;
    const remainingWeight = (100 - evaluatedPercentage) / 100;
    const earnedContribution = currentAverage * evaluatedWeight;
    const requiredGrade = (targetGrade - earnedContribution) / remainingWeight;
    const contributionTolerance =
      Number.EPSILON * Math.max(1, Math.abs(targetGrade), Math.abs(earnedContribution)) * 8;
    const gradeTolerance = contributionTolerance / remainingWeight;

    if (Math.abs(requiredGrade) <= gradeTolerance) {
      return 0;
    }

    if (Math.abs(requiredGrade - 5) <= gradeTolerance) {
      return 5;
    }

    return Math.max(0, requiredGrade);
  }

  /** Prevents nonfinite values, invalid grade scales and a zero remaining weight. */
  private static validateNumbers(
    currentAverage: number,
    evaluatedPercentage: number,
    targetGrade: number,
  ): string {
    if (
      !Number.isFinite(currentAverage) ||
      !Number.isFinite(evaluatedPercentage) ||
      !Number.isFinite(targetGrade)
    ) {
      return 'Ingresa números válidos. Puedes usar punto o coma para los decimales.';
    }

    if (currentAverage < 0 || currentAverage > 5) {
      return 'El promedio actual debe estar entre 0 y 5.';
    }

    if (evaluatedPercentage <= 0 || evaluatedPercentage >= 100) {
      return 'El porcentaje evaluado debe ser mayor que 0 y menor que 100.';
    }

    if (targetGrade < 0 || targetGrade > 5) {
      return 'La meta final debe estar entre 0 y 5.';
    }

    return '';
  }
}
