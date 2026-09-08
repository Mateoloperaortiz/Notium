<script setup lang="ts">
// Internal imports
import type { CreateGradeDTO, GradeValidationErrorsDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
// External imports
import { computed, reactive, ref, useId, watch } from 'vue';

// Interfaces and types
interface Props {
  grade?: GradeInterface;
  loading?: boolean;
  subjects: SubjectInterface[];
}

interface Emits {
  cancel: [];
  submit: [grade: CreateGradeDTO, subjectId: string];
}

type FormField = keyof GradeValidationErrorsDTO;

// Props and emits
const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<Emits>();

// Form variables
const formId = useId();
const form = reactive<CreateGradeDTO>({
  date: new Date(),
  percentage: 20,
  title: '',
  type: '',
  value: 0,
});
const subjectId = ref<string>('');
const associationError = ref<string>('');
const dateValue = ref<string>('');
const titleInputId = `${formId}-title`;
const typeInputId = `${formId}-type`;
const valueInputId = `${formId}-value`;
const percentageInputId = `${formId}-percentage`;
const dateInputId = `${formId}-date`;

// Error control variables
const fieldOrder: FormField[] = ['title', 'type', 'value', 'percentage', 'date'];
const errors = reactive<GradeValidationErrorsDTO>({
  date: '',
  percentage: '',
  title: '',
  type: '',
  value: '',
});
const touched = reactive<Record<FormField, boolean>>({
  date: false,
  percentage: false,
  title: false,
  type: false,
  value: false,
});
const submissionAttempted = ref<boolean>(false);

// Derived form state
const isEditing = computed<boolean>((): boolean => props.grade !== undefined);
const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: FormField): boolean => errors[field] !== ''),
);

// Error control functions
const validateField = (field: FormField): boolean => {
  touched[field] = true;
  errors[field] = GradeService.validateFields({ ...form })[field];
  return errors[field] === '';
};

const revalidateField = (field: FormField): void => {
  if (touched[field] || submissionAttempted.value) validateField(field);
};

const validateForm = (): boolean =>
  fieldOrder.map((field: FormField): boolean => validateField(field)).every(Boolean);

const resetValidation = (): void => {
  fieldOrder.forEach((field: FormField): void => {
    errors[field] = '';
    touched[field] = false;
  });
  submissionAttempted.value = false;
};

// Form handlers
const handleSubmit = (): void => {
  if (props.loading) return;
  associationError.value = subjectId.value ? '' : 'Selecciona una materia.';
  form.date = new Date(`${dateValue.value}T00:00:00`);
  submissionAttempted.value = true;
  if (!validateForm() || associationError.value) return;
  emit('submit', { ...form }, subjectId.value);
};

const handleCancel = (): void => emit('cancel');

// Synchronize form data with the selected grade
watch(
  (): GradeInterface | undefined => props.grade,
  (grade: GradeInterface | undefined): void => {
    form.date = grade?.date ?? new Date();
    form.percentage = grade?.percentage ?? 20;
    form.title = grade?.title ?? '';
    form.type = grade?.type ?? '';
    form.value = grade?.value ?? 0;
    subjectId.value = grade?.subject.id ?? '';
    associationError.value = '';
    dateValue.value = form.date.toISOString().slice(0, 10);
    resetValidation();
  },
  { immediate: true },
);
</script>

<template>
  <form class="grade-form" novalidate :aria-busy="loading" @submit.prevent="handleSubmit">
    <div v-if="submissionAttempted && hasValidationErrors" class="grade-form__alert" role="alert">
      Revisa los datos de la nota antes de continuar.
    </div>

    <label class="grade-form__field">
      <span>Materia</span>
      <select v-model="subjectId" required :disabled="loading || isEditing">
        <option value="">Selecciona una materia</option>
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
          :disabled="loading"
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
          :disabled="loading"
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
          :disabled="loading"
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
          :disabled="loading"
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
        v-model="dateValue"
        type="date"
        required
        :disabled="loading"
        @blur="validateField('date')"
        @input="revalidateField('date')"
      />
      <small v-if="errors.date">{{ errors.date }}</small>
    </label>

    <footer class="grade-form__actions">
      <button
        class="button button--secondary"
        type="button"
        :disabled="loading"
        @click="handleCancel"
      >
        Cancelar
      </button>
      <button class="button button--primary" type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear nota' }}
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
