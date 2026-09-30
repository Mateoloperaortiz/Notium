<script setup lang="ts">
// Internal imports
import type { CreateGradeDTO, GradeValidationErrorsDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { DateFormatUtil } from '@/utils/DateFormatUtil.js';

// External imports
import { computed, ref, useId } from 'vue';

// Props
const props = defineProps<{ grade?: GradeInterface; subjects: SubjectInterface[] }>();

// Emits
const emit = defineEmits<{
  cancel: [];
  submit: [grade: CreateGradeDTO, subjectId: number];
}>();

// State
const formId = useId();
const titleInputId = `${formId}-title`;
const typeInputId = `${formId}-type`;
const valueInputId = `${formId}-value`;
const percentageInputId = `${formId}-percentage`;
const dateInputId = `${formId}-date`;
const fieldOrder: (keyof GradeValidationErrorsDTO)[] = [
  'title',
  'type',
  'value',
  'percentage',
  'date',
];
const form = ref<CreateGradeDTO>({
  date: props.grade?.date ?? DateFormatUtil.getTodayIsoDate(),
  percentage: props.grade?.percentage ?? 20,
  title: props.grade?.title ?? '',
  type: props.grade?.type ?? '',
  value: props.grade?.value ?? 0,
});
const subjectId = ref<number>(props.grade?.subjectId ?? 0);
const associationError = ref<string>('');
const errors = ref<GradeValidationErrorsDTO>({
  date: '',
  percentage: '',
  title: '',
  type: '',
  value: '',
});
const touched = ref<Record<keyof GradeValidationErrorsDTO, boolean>>({
  date: false,
  percentage: false,
  title: false,
  type: false,
  value: false,
});
const submissionAttempted = ref<boolean>(false);

// Computed
const isEditing = computed<boolean>((): boolean => props.grade !== undefined);

const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: keyof GradeValidationErrorsDTO): boolean => errors.value[field] !== ''),
);

// Functions
function validateField(field: keyof GradeValidationErrorsDTO): boolean {
  touched.value[field] = true;
  errors.value[field] = GradeService.validateFields(form.value)[field];

  return errors.value[field] === '';
}

function revalidateField(field: keyof GradeValidationErrorsDTO): void {
  if (touched.value[field] || submissionAttempted.value) {
    validateField(field);
  }
}

function validateForm(): boolean {
  return fieldOrder
    .map((field: keyof GradeValidationErrorsDTO): boolean => validateField(field))
    .every(Boolean);
}

function handleSubmit(): void {
  associationError.value = subjectId.value ? '' : 'Selecciona una materia.';
  submissionAttempted.value = true;

  if (!validateForm() || associationError.value) {
    return;
  }

  emit('submit', { ...form.value }, subjectId.value);
}

function handleCancel(): void {
  emit('cancel');
}
</script>

<template>
  <form class="grade-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="submissionAttempted && hasValidationErrors" class="grade-form__alert" role="alert">
      Revisa los datos de la nota antes de continuar.
    </div>

    <label class="grade-form__field">
      <span>Materia</span>
      <select v-model="subjectId" required :disabled="isEditing">
        <option :value="0">Selecciona una materia</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.code }} · {{ subject.name }}
        </option>
      </select>
      <small v-if="associationError">{{ associationError }}</small>
    </label>

    <div class="grade-form__grid">
      <label class="grade-form__field" :for="titleInputId">
        <span>Título</span>
        <input
          :id="titleInputId"
          v-model="form.title"
          type="text"
          required
          @blur="validateField('title')"
          @input="revalidateField('title')"
        />
        <small v-if="errors.title">{{ errors.title }}</small>
      </label>
      <label class="grade-form__field" :for="typeInputId">
        <span>Tipo</span>
        <input
          :id="typeInputId"
          v-model="form.type"
          type="text"
          placeholder="Parcial, proyecto..."
          required
          @blur="validateField('type')"
          @input="revalidateField('type')"
        />
        <small v-if="errors.type">{{ errors.type }}</small>
      </label>
    </div>

    <div class="grade-form__grid">
      <label class="grade-form__field" :for="valueInputId">
        <span>Nota</span>
        <input
          :id="valueInputId"
          v-model.number="form.value"
          type="number"
          min="0"
          max="5"
          step="0.1"
          required
          @blur="validateField('value')"
          @input="revalidateField('value')"
        />
        <small v-if="errors.value">{{ errors.value }}</small>
      </label>
      <label class="grade-form__field" :for="percentageInputId">
        <span>Porcentaje</span>
        <input
          :id="percentageInputId"
          v-model.number="form.percentage"
          type="number"
          min="1"
          max="100"
          required
          @blur="validateField('percentage')"
          @input="revalidateField('percentage')"
        />
        <small v-if="errors.percentage">{{ errors.percentage }}</small>
      </label>
    </div>

    <label class="grade-form__field" :for="dateInputId">
      <span>Fecha</span>
      <input
        :id="dateInputId"
        v-model="form.date"
        type="date"
        required
        @blur="validateField('date')"
        @input="revalidateField('date')"
      />
      <small v-if="errors.date">{{ errors.date }}</small>
    </label>

    <footer class="grade-form__actions">
      <button class="button button--secondary" type="button" @click="handleCancel">Cancelar</button>
      <button class="button button--primary" type="submit">
        {{ isEditing ? 'Guardar cambios' : 'Crear nota' }}
      </button>
    </footer>
  </form>
</template>

<style scoped>
.grade-form {
  display: grid;
  gap: 1.1rem;
}
.grade-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.grade-form__field {
  display: grid;
  gap: 0.4rem;
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}
.grade-form__field input {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-white);
  color: var(--color-ink);
}
.grade-form__field input:focus {
  border-color: var(--color-accent);
  outline: 3px solid rgba(35, 107, 86, 0.16);
}
.grade-form__field small {
  color: var(--color-danger);
  font-weight: 600;
}
.grade-form__alert {
  padding: 0.8rem 0.9rem;
  border-radius: 0.7rem;
  background: var(--color-danger-light);
  color: var(--color-danger);
}
.grade-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}
@media (max-width: 40rem) {
  .grade-form__grid {
    grid-template-columns: 1fr;
  }
  .grade-form__actions {
    flex-direction: column-reverse;
  }
  .grade-form__actions .button {
    width: 100%;
  }
}
</style>
