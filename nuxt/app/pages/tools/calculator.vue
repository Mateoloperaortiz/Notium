<script setup lang="ts">
// Internal imports
import { GradeCalculatorUtil } from '../../utils/GradeCalculatorUtil.js';

// External imports
import { useSeoMeta } from '#imports';
import { computed, ref } from 'vue';

// State
const currentAverage = ref<string>('4,0');
const evaluatedPercentage = ref<string>('60');
const targetGrade = ref<string>('3,0');
const requiredGrade = ref<number | null>(null);
const errorMessage = ref<string>('');

// Computed
const remainingPercentage = computed<number>(
  (): number => 100 - GradeCalculatorUtil.parseValue(evaluatedPercentage.value),
);

const isTargetPossible = computed<boolean>(
  (): boolean => requiredGrade.value !== null && requiredGrade.value <= 5,
);

const formattedGrade = computed<string>((): string => {
  if (requiredGrade.value === null) {
    return '';
  }

  const hundredths = requiredGrade.value * 100;
  const roundingTolerance = Number.EPSILON * Math.abs(hundredths) * 8;

  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.ceil(hundredths - roundingTolerance) / 100);
});

// Functions
function clearResult(): void {
  requiredGrade.value = null;
  errorMessage.value = '';
}

function calculate(): void {
  requiredGrade.value = null;
  errorMessage.value = GradeCalculatorUtil.validateFields(
    currentAverage.value,
    evaluatedPercentage.value,
    targetGrade.value,
  );

  if (errorMessage.value) {
    return;
  }

  requiredGrade.value = GradeCalculatorUtil.getRequiredGrade(
    GradeCalculatorUtil.parseValue(currentAverage.value),
    GradeCalculatorUtil.parseValue(evaluatedPercentage.value),
    GradeCalculatorUtil.parseValue(targetGrade.value),
  );
}

useSeoMeta({
  title: 'Calculadora de notas',
  description:
    'Calcula el promedio que necesitas en las evaluaciones pendientes para alcanzar tu meta final, en una escala de cero a cinco.',
});
</script>

<template>
  <section aria-labelledby="calculator-title">
    <p class="eyebrow">Tu siguiente meta</p>
    <h1 id="calculator-title" class="page-heading">¿Qué nota necesito?</h1>
    <p class="lead">
      Usa tu promedio de las evaluaciones ya calificadas y el porcentaje que representan. Calculamos
      el promedio que necesitas en lo que falta, en una escala de 0 a 5.
    </p>

    <div class="calculator-layout">
      <form class="card calculator-form" novalidate @submit.prevent="calculate">
        <h2>Tus resultados actuales</h2>
        <p class="calculator-form__intro">Los tres campos son obligatorios.</p>

        <div class="form-field">
          <label for="current-average">Promedio de lo ya evaluado</label>
          <input
            id="current-average"
            v-model="currentAverage"
            name="currentAverage"
            type="text"
            inputmode="decimal"
            maxlength="20"
            required
            aria-describedby="average-hint"
            @input="clearResult"
          />
          <p id="average-hint">
            Entre 0 y 5. Si las evaluaciones tienen pesos distintos, usa su promedio ponderado.
          </p>
        </div>

        <div class="form-field">
          <label for="evaluated-percentage">Porcentaje ya evaluado</label>
          <div class="input-with-unit">
            <input
              id="evaluated-percentage"
              v-model="evaluatedPercentage"
              name="evaluatedPercentage"
              type="text"
              inputmode="decimal"
              maxlength="20"
              required
              aria-describedby="percentage-hint"
              @input="clearResult"
            />
            <span aria-hidden="true">%</span>
          </div>
          <p id="percentage-hint">
            Mayor que 0 y menor que 100. Es la suma de los pesos ya calificados.
          </p>
        </div>

        <div class="form-field">
          <label for="target-grade">Tu meta de nota final</label>
          <input
            id="target-grade"
            v-model="targetGrade"
            name="targetGrade"
            type="text"
            inputmode="decimal"
            maxlength="20"
            required
            aria-describedby="target-hint"
            @input="clearResult"
          />
          <p id="target-hint">Entre 0 y 5. Revisa en tu curso cuál es la nota de aprobación.</p>
        </div>

        <p v-if="errorMessage" class="status-message status-message--error" role="alert">
          {{ errorMessage }}
        </p>

        <button class="button" type="submit">
          Calcular nota necesaria <span aria-hidden="true">→</span>
        </button>
      </form>

      <div class="calculator-aside">
        <div class="calculator-result" aria-live="polite" aria-atomic="true">
          <template v-if="requiredGrade !== null">
            <p class="eyebrow">
              {{ isTargetPossible ? 'Tu objetivo es posible' : 'Ajusta tu objetivo' }}
            </p>
            <h2>{{ isTargetPossible ? 'Promedio que necesitas' : 'La meta supera la escala' }}</h2>
            <p class="calculator-result__value">{{ formattedGrade }}<span> / 5</span></p>
            <p v-if="!isTargetPossible" class="calculator-result__message">
              Necesitarías más de 5 en el {{ remainingPercentage }} % restante. Esa meta no se puede
              alcanzar con estos resultados; prueba una meta menor o revisa las opciones de tu
              curso.
            </p>
            <p v-else-if="requiredGrade === 0" class="calculator-result__message">
              El aporte que ya ganaste alcanza tu meta, incluso con 0 en el
              {{ remainingPercentage }} % restante. Revisa también los requisitos de asistencia y
              entrega de tu curso.
            </p>
            <p v-else class="calculator-result__message">
              Necesitas al menos este promedio ponderado en el {{ remainingPercentage }} % que
              falta. El resultado se redondea hacia arriba a dos decimales.
            </p>
          </template>
          <template v-else>
            <span class="calculator-result__symbol" aria-hidden="true">↗</span>
            <h2>Tu próximo paso, en números.</h2>
            <p class="calculator-result__message">
              Completa los campos y calcula. Aquí verás la nota necesaria y si tu meta está dentro
              de la escala.
            </p>
          </template>
        </div>

        <aside class="calculator-example" aria-labelledby="example-title">
          <h2 id="example-title">Un ejemplo para orientarte</h2>
          <p>
            Si tienes <strong>4,0 de promedio</strong> en el <strong>60 %</strong> evaluado, ya
            aportaste <strong>2,4</strong> a tu nota final. Para terminar con <strong>3,0</strong>,
            necesitas <strong>1,50</strong> en el <strong>40 %</strong> restante.
          </p>
          <p class="calculator-example__formula">
            Nota necesaria = (meta − promedio actual × porcentaje evaluado / 100) ÷ (1 − porcentaje
            evaluado / 100).
          </p>
          <p class="calculator-example__note">
            Esta proyección supone que los porcentajes del curso suman 100 %. Las reglas de redondeo
            y aprobación las define tu curso.
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.calculator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  align-items: start;
  gap: 2rem;
}

.calculator-form {
  padding: clamp(1.5rem, 3vw, 2rem);
}

.calculator-form__intro {
  margin-bottom: 1.75rem;
  font-size: 0.82rem;
}

.form-field + .form-field {
  margin-top: 1.3rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.88rem;
  font-weight: 700;
}

.form-field input {
  width: 100%;
  min-height: 3rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #a4b3a8;
  border-radius: 0.5rem;
  background: var(--color-white);
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}

.form-field p {
  margin: 0.45rem 0 0;
  color: var(--color-muted);
  font-size: 0.74rem;
  line-height: 1.6;
}

.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 2.5rem;
}

.input-with-unit span {
  position: absolute;
  top: 50%;
  right: 1rem;
  color: var(--color-muted);
  transform: translateY(-50%);
}

.calculator-form > .button {
  width: 100%;
  margin-top: 1.6rem;
}

.calculator-form .status-message {
  margin: 1.5rem 0 0;
  font-size: 0.85rem;
}

.calculator-result {
  min-height: 19rem;
  padding: clamp(1.5rem, 3vw, 2rem);
  border: 1px solid #c6d6c7;
  border-radius: 1.1rem;
  background: #e7eee3;
}

.calculator-result h2 {
  max-width: 20rem;
  font-size: 1.4rem;
}

.calculator-result__symbol {
  display: block;
  margin-bottom: 1.7rem;
  color: var(--color-accent);
  font-size: 2.4rem;
  line-height: 1;
}

.calculator-result__value {
  margin: 1rem 0;
  color: var(--color-accent-dark);
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 750;
  letter-spacing: -0.055em;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.calculator-result__value span {
  color: #4c6255;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0;
}

.calculator-result__message {
  margin: 0;
  color: #4c6255;
  font-size: 0.87rem;
  line-height: 1.8;
}

.calculator-example {
  margin-top: 1.6rem;
  padding: 0 0.25rem;
}

.calculator-example h2 {
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.calculator-example p {
  color: var(--color-muted);
  font-size: 0.83rem;
  line-height: 1.8;
}

.calculator-example strong {
  color: var(--color-ink);
}

.calculator-example .calculator-example__formula,
.calculator-example .calculator-example__note {
  font-size: 0.72rem;
}

.calculator-example__formula {
  padding: 0.8rem;
  border-left: 2px solid #b6c9b8;
}

@media (max-width: 760px) {
  .calculator-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .calculator-result {
    min-height: 0;
  }
}
</style>
