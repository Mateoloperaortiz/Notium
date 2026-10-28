/** Calculates the average still needed in a course with grades from zero to five. */
export class GradeCalculatorUtil {
  private static readonly MAX_GRADE = 5;

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
    const remainingWeight = GradeCalculatorUtil.getRemainingPercentage(evaluatedPercentage) / 100;
    const earnedContribution = currentAverage * evaluatedWeight;
    const requiredGrade = (targetGrade - earnedContribution) / remainingWeight;
    const contributionTolerance =
      Number.EPSILON * Math.max(1, Math.abs(targetGrade), Math.abs(earnedContribution)) * 8;
    const gradeTolerance = contributionTolerance / remainingWeight;

    if (Math.abs(requiredGrade) <= gradeTolerance) {
      return 0;
    }

    if (Math.abs(requiredGrade - GradeCalculatorUtil.MAX_GRADE) <= gradeTolerance) {
      return GradeCalculatorUtil.MAX_GRADE;
    }

    return Math.max(0, requiredGrade);
  }

  /** Returns the share of the course that has not been graded yet. */
  public static getRemainingPercentage(evaluatedPercentage: number): number {
    return 100 - evaluatedPercentage;
  }

  /** Tells whether the required grade fits within the zero-to-five scale. */
  public static isTargetPossible(requiredGrade: number): boolean {
    return requiredGrade <= GradeCalculatorUtil.MAX_GRADE;
  }

  /** Rounds a grade up to two decimals and writes it with a decimal comma. */
  public static formatGrade(grade: number): string {
    const hundredths = grade * 100;
    const roundingTolerance = Number.EPSILON * Math.abs(hundredths) * 8;

    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.ceil(hundredths - roundingTolerance) / 100);
  }

  /** Writes a percentage with a decimal comma and at most two decimals. */
  public static formatPercentage(percentage: number): string {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(percentage);
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

    if (currentAverage < 0 || currentAverage > GradeCalculatorUtil.MAX_GRADE) {
      return 'El promedio actual debe estar entre 0 y 5.';
    }

    if (evaluatedPercentage <= 0 || evaluatedPercentage >= 100) {
      return 'El porcentaje evaluado debe ser mayor que 0 y menor que 100.';
    }

    if (targetGrade < 0 || targetGrade > GradeCalculatorUtil.MAX_GRADE) {
      return 'La meta final debe estar entre 0 y 5.';
    }

    return '';
  }
}
