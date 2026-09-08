<script setup lang="ts">
// Internal imports
import type { CreateSubjectDTO, SubjectValidationErrorsDTO } from '@/dtos/SubjectDTOs.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { SubjectService } from '@/services/SubjectService.js';
// External imports
import { computed, reactive, ref, useId, watch } from 'vue';

// Interfaces and types
interface Props {
  loading?: boolean;
  subject?: SubjectInterface;
}

interface Emits {
  cancel: [];
  submit: [subject: CreateSubjectDTO];
}

type FormField = keyof SubjectValidationErrorsDTO;

// Props and emits
const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<Emits>();

// Form variables
const formId = useId();
const form = reactive<CreateSubjectDTO>({
  code: '',
  credits: 3,
  name: '',
  professor: '',
});
const codeInputId = `${formId}-code`;
const nameInputId = `${formId}-name`;
const creditsInputId = `${formId}-credits`;
const professorInputId = `${formId}-professor`;

// Error control variables
const fieldOrder: FormField[] = ['code', 'name', 'credits', 'professor'];
const errors = reactive<SubjectValidationErrorsDTO>({
  code: '',
  credits: '',
  name: '',
  professor: '',
});
const touched = reactive<Record<FormField, boolean>>({
  code: false,
  credits: false,
  name: false,
  professor: false,
});
const submissionAttempted = ref<boolean>(false);

// Derived form state
const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: FormField): boolean => errors[field] !== ''),
);
const isEditing = computed<boolean>((): boolean => props.subject !== undefined);

// Error control functions
const validateField = (field: FormField): boolean => {
  touched[field] = true;
  errors[field] = SubjectService.validateFields({ ...form })[field];
  return errors[field] === '';
};

const revalidateField = (field: FormField): void => {
  if (touched[field] || submissionAttempted.value) {
    validateField(field);
  }
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
  submissionAttempted.value = true;

  if (!validateForm()) return;
  emit('submit', { ...form });
};

const handleCancel = (): void => emit('cancel');

// Synchronize form data with the selected subject
watch(
  (): SubjectInterface | undefined => props.subject,
  (subject: SubjectInterface | undefined): void => {
    form.code = subject?.code ?? '';
    form.credits = subject?.credits ?? 3;
    form.name = subject?.name ?? '';
    form.professor = subject?.professor ?? '';
    resetValidation();
  },
  { immediate: true },
);
</script>

<template>
  <form
    class="subject-form"
    novalidate
    :aria-busy="loading"
    :aria-label="isEditing ? 'Editar materia' : 'Crear materia'"
    @submit.prevent="handleSubmit"
  >
    <div v-if="submissionAttempted && hasValidationErrors" class="subject-form__alert" role="alert">
      Revisa los datos de la materia antes de continuar.
    </div>

    <div class="subject-form__grid">
      <label class="subject-form__field">
        <span>Código</span>
        <input
          :id="codeInputId"
          v-model="form.code"
          type="text"
          maxlength="20"
          required
          :aria-invalid="errors.code !== ''"
          :disabled="loading"
          @blur="validateField('code')"
          @input="revalidateField('code')"
        />
        <small v-if="errors.code">{{ errors.code }}</small>
      </label>

      <label class="subject-form__field">
        <span>Créditos</span>
        <input
          :id="creditsInputId"
          v-model.number="form.credits"
          type="number"
          min="1"
          max="30"
          required
          :aria-invalid="errors.credits !== ''"
          :disabled="loading"
          @blur="validateField('credits')"
          @input="revalidateField('credits')"
        />
        <small v-if="errors.credits">{{ errors.credits }}</small>
      </label>
    </div>

    <label class="subject-form__field">
      <span>Nombre de la materia</span>
      <input
        :id="nameInputId"
        v-model="form.name"
        type="text"
        maxlength="120"
        required
        :aria-invalid="errors.name !== ''"
        :disabled="loading"
        @blur="validateField('name')"
        @input="revalidateField('name')"
      />
      <small v-if="errors.name">{{ errors.name }}</small>
    </label>

    <label class="subject-form__field">
      <span>Profesor</span>
      <input
        :id="professorInputId"
        v-model="form.professor"
        type="text"
        maxlength="120"
        required
        :aria-invalid="errors.professor !== ''"
        :disabled="loading"
        @blur="validateField('professor')"
        @input="revalidateField('professor')"
      />
      <small v-if="errors.professor">{{ errors.professor }}</small>
    </label>

    <footer class="subject-form__actions">
      <button
        class="button button--secondary"
        type="button"
        :disabled="loading"
        @click="handleCancel"
      >
        Cancelar
      </button>
      <button class="button button--primary" type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear materia' }}
      </button>
    </footer>
  </form>
</template>

<style scoped>
.subject-form {
  display: grid;
  gap: 1.15rem;
}
.subject-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.subject-form__field {
  display: grid;
  gap: 0.4rem;
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}
.subject-form__field input {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-white);
  color: var(--color-ink);
}
.subject-form__field input:focus {
  border-color: var(--color-accent);
  outline: 3px solid rgba(35, 107, 86, 0.16);
}
.subject-form__field small {
  color: var(--color-danger);
  font-weight: 600;
}
.subject-form__alert {
  padding: 0.8rem 0.9rem;
  border-radius: 0.7rem;
  background: var(--color-danger-light);
  color: var(--color-danger);
}
.subject-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding-top: 0.4rem;
}
@media (max-width: 40rem) {
  .subject-form__grid {
    grid-template-columns: 1fr;
  }
  .subject-form__actions {
    flex-direction: column-reverse;
  }
  .subject-form__actions .button {
    width: 100%;
  }
}
</style>
