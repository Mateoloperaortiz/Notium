import assert from 'node:assert/strict';
import test from 'node:test';

import { GradeCalculatorUtil } from '../app/utils/GradeCalculatorUtil.ts';

test('the remaining grade uses the evaluated average and its actual weight', () => {
  const result = GradeCalculatorUtil.getRequiredGrade(4, 60, 3);
  assert.ok(Math.abs(result - 1.5) < 1e-12);
  assert.ok(Math.abs(4 * 0.6 + result * 0.4 - 3) < 1e-12);
});

test('zero and five are valid endpoints of the grade scale', () => {
  assert.equal(GradeCalculatorUtil.validateFields('0', '50', '0'), '');
  assert.equal(GradeCalculatorUtil.validateFields('5', '50', '5'), '');
  assert.equal(GradeCalculatorUtil.getRequiredGrade(0, 50, 0), 0);
  assert.equal(GradeCalculatorUtil.getRequiredGrade(0, 50, 2.5), 5);
  assert.equal(GradeCalculatorUtil.getRequiredGrade(5, 50, 5), 5);
});

test('an already earned target needs no further grade contribution', () => {
  assert.equal(GradeCalculatorUtil.getRequiredGrade(5, 80, 3), 0);
  assert.equal(GradeCalculatorUtil.getRequiredGrade(4, 75, 3), 0);
  assert.equal(GradeCalculatorUtil.getRequiredGrade(4.2, 95, 3.99), 0);
  assert.equal(GradeCalculatorUtil.getRequiredGrade(4.1, 99, 4.059), 0);
  assert.ok(GradeCalculatorUtil.getRequiredGrade(4.2, 95, 3.9900001) > 0);
});

test('an unreachable target keeps the result above five instead of hiding the shortfall', () => {
  const result = GradeCalculatorUtil.getRequiredGrade(0, 80, 3);
  assert.ok(result > 5);
  assert.ok(Math.abs(result - 15) < 1e-12);
});

test('floating-point noise at five does not make a reachable target look impossible', () => {
  const boundaryCases = [
    { percentage: 90, target: 4.19 },
    { percentage: 99, target: 4.109 },
    { percentage: 99.9, target: 4.1009 },
    { percentage: 99.9999, target: 4.1000009 },
    { percentage: 99.999999, target: 4.100000009 },
  ];
  for (const { percentage, target } of boundaryCases) {
    assert.equal(GradeCalculatorUtil.getRequiredGrade(4.1, percentage, target), 5);
    const genuinelyUnreachable = GradeCalculatorUtil.getRequiredGrade(
      4.1,
      percentage,
      target + 1e-7,
    );
    assert.ok(genuinelyUnreachable > 5, `${percentage}% must not hide a higher target.`);
  }

  const genuinelyUnreachable = GradeCalculatorUtil.getRequiredGrade(4.1, 90, 4.1900001);
  assert.ok(Math.abs(genuinelyUnreachable - 5.000001) < 1e-12);
});

test('decimal commas and surrounding spaces are accepted', () => {
  assert.equal(GradeCalculatorUtil.parseValue(' 4,5 '), 4.5);
  assert.equal(GradeCalculatorUtil.parseValue('3.25'), 3.25);
  assert.equal(GradeCalculatorUtil.validateFields(' 4,5 ', '60', '3,0'), '');
  const result = GradeCalculatorUtil.getRequiredGrade(
    GradeCalculatorUtil.parseValue('4,5'),
    GradeCalculatorUtil.parseValue('60'),
    GradeCalculatorUtil.parseValue('3,0'),
  );
  assert.ok(Math.abs(result - 0.75) < 1e-12);
});

test('each input is required and cannot be silently interpreted as zero', () => {
  for (const emptyValue of ['', '   ']) {
    for (let position = 0; position < 3; position += 1) {
      const fields = ['4', '60', '3'];
      fields[position] = emptyValue;
      assert.equal(
        GradeCalculatorUtil.validateFields(...fields),
        'Completa los tres campos para calcular la nota que necesitas.',
      );
    }
    assert.ok(Number.isNaN(GradeCalculatorUtil.parseValue(emptyValue)));
  }
});

test('malformed and nonfinite text is rejected in every field', () => {
  for (const invalidValue of ['NaN', 'Infinity', '-Infinity', '4abc', '1,2,3']) {
    assert.ok(Number.isNaN(GradeCalculatorUtil.parseValue(invalidValue)), invalidValue);
    for (let position = 0; position < 3; position += 1) {
      const fields = ['4', '60', '3'];
      fields[position] = invalidValue;
      assert.equal(
        GradeCalculatorUtil.validateFields(...fields),
        'Ingresa números válidos. Puedes usar punto o coma para los decimales.',
      );
    }
  }
});

test('the evaluated percentage must leave both an earned and a remaining weight', () => {
  for (const percentage of ['-1', '0', '100', '101']) {
    assert.equal(
      GradeCalculatorUtil.validateFields('4', percentage, '3'),
      'El porcentaje evaluado debe ser mayor que 0 y menor que 100.',
    );
  }
  assert.equal(GradeCalculatorUtil.validateFields('4', '0,1', '3'), '');
  assert.equal(GradeCalculatorUtil.validateFields('4', '99,9', '3'), '');
});

test('both the current average and the target must stay on the zero-to-five scale', () => {
  for (const grade of ['-0,1', '5,1']) {
    assert.equal(
      GradeCalculatorUtil.validateFields(grade, '60', '3'),
      'El promedio actual debe estar entre 0 y 5.',
    );
    assert.equal(
      GradeCalculatorUtil.validateFields('4', '60', grade),
      'La meta final debe estar entre 0 y 5.',
    );
  }
});

test('the numeric API raises RangeError for nonfinite or out-of-domain values', () => {
  const invalidInputs = [
    [-0.1, 60, 3],
    [5.1, 60, 3],
    [4, -1, 3],
    [4, 0, 3],
    [4, 100, 3],
    [4, 101, 3],
    [4, 60, -0.1],
    [4, 60, 5.1],
  ];
  for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    invalidInputs.push([value, 60, 3], [4, value, 3], [4, 60, value]);
  }
  for (const inputs of invalidInputs) {
    assert.throws(() => GradeCalculatorUtil.getRequiredGrade(...inputs), RangeError);
  }
});
