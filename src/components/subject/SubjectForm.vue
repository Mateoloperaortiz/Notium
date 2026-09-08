<script setup lang="ts">
// Internal imports
import type { CreateSemesterDTO, SemesterValidationErrorsDTO } from '@/dtos/SemesterDTOs.js';
import { StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
// External imports
import { computed, reactive, ref, useId, watch } from 'vue';

// Interfaces and types
interface Props {
  loading?: boolean;
  semester?: SemesterInterface;
}

interface Emits {
  cancel: [];
  submit: [semester: CreateSemesterDTO];
}

type FormField = keyof SemesterValidationErrorsDTO;

// Props and emits
const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

// Form variables
const fieldOrder: FormField[] = ['name', 'year', 'period', 'status'];
const formId = useId();
const name = ref<string>('');
const nameInput = ref<HTMLInputElement | null>(null);
const year = ref<number>(new Date().getFullYear());
const period = ref<number>(1);
const status = ref<StatusSemester>(StatusSemester.inComing);
const nameInputId = `${formId}-name`;
const yearInputId = `${formId}-year`;
const periodInputId = `${formId}-period`;
const statusInputId = `${formId}-status`;
const submissionAttempted = ref<boolean>(false);

// Error control variables
const errors = reactive<SemesterValidationErrorsDTO>({
  name: '',
  period: '',
  status: '',
  year: '',
});

const touched = reactive<Record<FormField, boolean>>({
  name: false,
  period: false,
  status: false,
  year: false,
});

const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: FormField): boolean => errors[field] !== ''),
);

const isEditing = computed<boolean>((): boolean => props.semester !== undefined);

// Form data mapping
const getSemesterDTO = (): CreateSemesterDTO => ({
  name: name.value,
  period: period.value,
  status: status.value,
  year: year.value,
});

// Error control functions
const validateField = (field: FormField): boolean => {
  touched[field] = true;

  const semesterDTO: CreateSemesterDTO = getSemesterDTO();
  const validationErrors: SemesterValidationErrorsDTO = SemesterService.validateFields(semesterDTO);
  errors[field] = validationErrors[field];

  return errors[field] === '';
};

const revalidateField = (field: FormField): void => {
  if (touched[field] || submissionAttempted.value) {
    validateField(field);
  }
};

const validateForm = (): boolean => {
  return fieldOrder
    .map((field: FormField): boolean => validateField(field))
    .every((fieldIsValid: boolean): boolean => fieldIsValid);
};

const focusField = (field: FormField): void => {
  if (field === 'name') {
    nameInput.value?.focus();
  }
};

const resetValidation = (): void => {
  fieldOrder.forEach((field: FormField): void => {
    errors[field] = '';
    touched[field] = false;
  });

  submissionAttempted.value = false;
};

// Form handlers
const handleSubmit = (): void => {
  if (props.loading) {
    return;
  }

  submissionAttempted.value = true;

  if (!validateForm()) {
    const firstInvalidField = fieldOrder.find((field: FormField): boolean => errors[field] !== '');

    if (firstInvalidField !== undefined) {
      focusField(firstInvalidField);
    }

    return;
  }

  const semesterDTO: CreateSemesterDTO = getSemesterDTO();

  emit('submit', semesterDTO);
};

const handleCancel = (): void => {
  emit('cancel');
};

watch(
  (): readonly [string, number, number, StatusSemester] => [
    props.semester?.name ?? '',
    props.semester?.year ?? new Date().getFullYear(),
    props.semester?.period ?? 1,
    props.semester?.status ?? StatusSemester.inComing,
  ],
  ([semesterName, semesterYear, semesterPeriod, semesterStatus]: readonly [
    string,
    number,
    number,
    StatusSemester,
  ]): void => {
    name.value = semesterName;
    year.value = semesterYear;
    period.value = semesterPeriod;
    status.value = semesterStatus;
    resetValidation();
  },
  { immediate: true },
);
</script>

<template>
  <form
    class="semester-form"
    novalidate
    :aria-busy="loading"
    :aria-label="isEditing ? 'Editar semestre' : 'Crear semestre'"
    @submit.prevent="handleSubmit"
  >
    <div
      v-if="submissionAttempted && hasValidationErrors"
      class="semester-form__alert"
      role="alert"
      aria-live="assertive"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6.5v4M10 13.5h.01" />
      </svg>
      <p><strong>Revisa el formulario.</strong> Hay campos que necesitan tu atención.</p>
    </div>

    <div class="semester-form__field semester-form__field--full">
      <label :for="nameInputId">Nombre del semestre</label>
      <div class="semester-form__input-wrap" :class="{ 'is-invalid': errors.name }">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M6 3v3M14 3v3M4 8h12" />
          <rect x="3" y="4.5" width="14" height="13" rx="2.5" />
        </svg>
        <input
          :id="nameInputId"
          ref="nameInput"
          v-model="name"
          type="text"
          name="semester-name"
          maxlength="80"
          autocomplete="off"
          placeholder="Ej. 2026-1"
          required
          :aria-describedby="
            errors.name ? `${nameInputId}-hint ${nameInputId}-error` : `${nameInputId}-hint`
          "
          :aria-invalid="errors.name !== ''"
          :disabled="loading"
          @blur="validateField('name')"
          @input="revalidateField('name')"
        />
      </div>
      <p :id="`${nameInputId}-hint`" class="semester-form__hint">
        Usa un nombre corto que puedas reconocer fácilmente.
      </p>
      <p v-if="errors.name" :id="`${nameInputId}-error`" class="semester-form__error" role="alert">
        {{ errors.name }}
      </p>
    </div>

    <div class="semester-form__date-grid">
      <div class="semester-form__field">
        <label :for="yearInputId">Año</label>
        <div class="semester-form__input-wrap" :class="{ 'is-invalid': errors.year }">
          <input
            :id="yearInputId"
            v-model.number="year"
            type="number"
            name="semester-year"
            min="2000"
            required
            :aria-describedby="errors.year ? `${yearInputId}-error` : undefined"
            :aria-invalid="errors.year !== ''"
            :disabled="loading"
            @blur="validateField('year')"
            @input="revalidateField('year')"
          />
        </div>
        <p
          v-if="errors.year"
          :id="`${yearInputId}-error`"
          class="semester-form__error"
          role="alert"
        >
          {{ errors.year }}
        </p>
      </div>

      <div class="semester-form__date-connector" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="m7 5 5 5-5 5" />
        </svg>
      </div>

      <div class="semester-form__field">
        <label :for="periodInputId">Periodo</label>
        <div class="semester-form__input-wrap" :class="{ 'is-invalid': errors.period }">
          <select
            :id="periodInputId"
            v-model.number="period"
            name="semester-period"
            required
            :aria-describedby="errors.period ? `${periodInputId}-error` : undefined"
            :aria-invalid="errors.period !== ''"
            :disabled="loading"
            @blur="validateField('period')"
            @change="revalidateField('period')"
          >
            <option :value="1">1</option>
            <option :value="2">2</option>
          </select>
        </div>
        <p
          v-if="errors.period"
          :id="`${periodInputId}-error`"
          class="semester-form__error"
          role="alert"
        >
          {{ errors.period }}
        </p>
      </div>
    </div>

    <div class="semester-form__field">
      <label :for="statusInputId">Estado</label>
      <div class="semester-form__input-wrap" :class="{ 'is-invalid': errors.status }">
        <select
          :id="statusInputId"
          v-model="status"
          name="semester-status"
          required
          :aria-describedby="errors.status ? `${statusInputId}-error` : undefined"
          :aria-invalid="errors.status !== ''"
          :disabled="loading"
          @blur="validateField('status')"
          @change="revalidateField('status')"
        >
          <option :value="StatusSemester.inComing">{{ StatusSemester.inComing }}</option>
          <option :value="StatusSemester.inProgress">{{ StatusSemester.inProgress }}</option>
          <option :value="StatusSemester.ended">{{ StatusSemester.ended }}</option>
        </select>
      </div>
      <p
        v-if="errors.status"
        :id="`${statusInputId}-error`"
        class="semester-form__error"
        role="alert"
      >
        {{ errors.status }}
      </p>
    </div>

    <div class="semester-form__note">
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 9v4M10 6.5h.01" />
      </svg>
      <p>Podrás agregar materias y notas después de guardar el semestre.</p>
    </div>

    <footer class="semester-form__actions">
      <button
        class="semester-form__button semester-form__button--secondary"
        type="button"
        :disabled="loading"
        @click="handleCancel"
      >
        Cancelar
      </button>

      <button
        class="semester-form__button semester-form__button--primary"
        type="submit"
        :disabled="loading"
      >
        <span v-if="loading" class="semester-form__spinner" aria-hidden="true"></span>
        <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 10.5 8 14l8-8" />
        </svg>
        {{ loading ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear semestre' }}
      </button>
    </footer>
  </form>
</template>

<style scoped>
.semester-form {
  --form-accent: var(--color-accent, #236b56);
  --form-border: var(--color-border, #dfe4ec);
  --form-danger: var(--color-danger, #d92d20);
  --form-muted: var(--color-muted, #667085);
  --form-surface: var(--color-surface, #ffffff);
  --form-text: var(--color-ink, #182230);
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.35rem;
  color: var(--form-text);
}

.semester-form__alert {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid #fecaca;
  border-radius: 0.7rem;
  background: #fff6f5;
  color: #b42318;
  font-size: 0.84rem;
  line-height: 1.45;
}

.semester-form__alert svg,
.semester-form__note svg {
  width: 1.1rem;
  flex: 0 0 auto;
  margin-top: 0.08rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.semester-form__alert p,
.semester-form__note p {
  margin: 0;
}

.semester-form__date-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
}

.semester-form__field {
  min-width: 0;
}

.semester-form__field label {
  display: inline-block;
  margin-bottom: 0.45rem;
  color: var(--form-text);
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.4;
}

.semester-form__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--form-border);
  border-radius: 0.7rem;
  background: var(--form-surface);
  box-shadow: 0 1px 2px rgb(16 24 40 / 4%);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.semester-form__input-wrap:focus-within {
  border-color: var(--form-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--form-accent) 15%, transparent);
}

.semester-form__input-wrap.is-invalid {
  border-color: var(--form-danger);
}

.semester-form__input-wrap.is-invalid:focus-within {
  box-shadow: 0 0 0 3px rgb(217 45 32 / 12%);
}

.semester-form__input-wrap > svg {
  position: absolute;
  left: 0.85rem;
  width: 1.05rem;
  pointer-events: none;
  stroke: var(--form-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.semester-form__input-wrap input {
  width: 100%;
  min-width: 0;
  min-height: 2.8rem;
  padding: 0.68rem 0.85rem;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--form-text);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
}

.semester-form__input-wrap > svg + input {
  padding-left: 2.55rem;
}

.semester-form__input-wrap input::placeholder {
  color: #98a2b3;
}

.semester-form__input-wrap input:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.semester-form__input-wrap:has(input:disabled) {
  background: #f2f4f7;
}

.semester-form__hint,
.semester-form__error {
  margin: 0.4rem 0 0;
  font-size: 0.76rem;
  line-height: 1.4;
}

.semester-form__hint {
  color: var(--form-muted);
}

.semester-form__error {
  color: var(--form-danger);
  font-weight: 600;
}

.semester-form__date-connector {
  display: grid;
  width: 1.75rem;
  height: 1.75rem;
  margin-top: 2.25rem;
  place-items: center;
  border-radius: 50%;
  background: #f2f4f7;
  color: var(--form-muted);
}

.semester-form__date-connector svg {
  width: 0.95rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.semester-form__note {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--form-accent) 6%, white);
  color: color-mix(in srgb, var(--form-accent) 75%, #263044);
  font-size: 0.8rem;
  line-height: 1.45;
}

.semester-form__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-top: 0.15rem;
}

.semester-form__button {
  display: inline-flex;
  min-height: 2.65rem;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.68rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.7rem;
  font: inherit;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.semester-form__button svg {
  width: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.semester-form__button--secondary {
  border-color: var(--form-border);
  background: var(--form-surface);
  color: var(--form-text);
}

.semester-form__button--secondary:hover:not(:disabled) {
  background: #f8fafc;
  color: var(--form-text);
}

.semester-form__button--primary {
  background: var(--form-accent);
  box-shadow: 0 1px 2px rgb(16 24 40 / 10%);
  color: white;
}

.semester-form__button--primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--form-accent) 88%, black);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--form-accent) 22%, transparent);
  transform: translateY(-1px);
}

.semester-form__button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--form-accent) 25%, transparent);
  outline-offset: 2px;
}

.semester-form__button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.semester-form__spinner {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid rgb(255 255 255 / 45%);
  border-top-color: white;
  border-radius: 50%;
  animation: semester-form-spin 700ms linear infinite;
}

@keyframes semester-form-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 40rem) {
  .semester-form__date-grid {
    grid-template-columns: 1fr;
  }

  .semester-form__date-connector {
    display: none;
  }

  .semester-form__actions {
    flex-direction: column-reverse;
  }

  .semester-form__button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .semester-form__input-wrap,
  .semester-form__button {
    transition: none;
  }

  .semester-form__button--primary:hover:not(:disabled) {
    transform: none;
  }

  .semester-form__spinner {
    animation-duration: 1.5s;
  }
}
</style>
