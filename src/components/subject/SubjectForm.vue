<script setup lang="ts">
// Internal imports
import type { CreateSubjectDTO, SubjectValidationErrorsDTO } from '@/dtos/SubjectDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { SubjectService } from '@/services/SubjectService.js';

// External imports
import { computed, ref, useId } from 'vue';

// Props
const props = defineProps<{ semesters: SemesterInterface[]; subject?: SubjectInterface }>();

// Emits
const emit = defineEmits<{
  cancel: [];
  submit: [subject: CreateSubjectDTO, semesterId: number];
}>();

// State
const formId = useId();
const codeInputId = `${formId}-code`;
const nameInputId = `${formId}-name`;
const creditsInputId = `${formId}-credits`;
const professorInputId = `${formId}-professor`;
const fieldOrder: (keyof SubjectValidationErrorsDTO)[] = ['code', 'name', 'credits', 'professor'];
const form = ref<CreateSubjectDTO>({
  code: props.subject?.code ?? '',
  credits: props.subject?.credits ?? 3,
  name: props.subject?.name ?? '',
  professor: props.subject?.professor ?? '',
});
const semesterId = ref<number>(props.subject?.semesterId ?? 0);
const associationError = ref<string>('');
const errors = ref<SubjectValidationErrorsDTO>({ code: '', credits: '', name: '', professor: '' });
const touched = ref<Record<keyof SubjectValidationErrorsDTO, boolean>>({
  code: false,
  credits: false,
  name: false,
  professor: false,
});
const submissionAttempted = ref<boolean>(false);

// Computed
const isEditing = computed<boolean>((): boolean => props.subject !== undefined);

const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: keyof SubjectValidationErrorsDTO): boolean => errors.value[field] !== ''),
);

// Functions
function validateField(field: keyof SubjectValidationErrorsDTO): boolean {
  touched.value[field] = true;
  errors.value[field] = SubjectService.validateFields(form.value)[field];

  return errors.value[field] === '';
}

function revalidateField(field: keyof SubjectValidationErrorsDTO): void {
  if (touched.value[field] || submissionAttempted.value) {
    validateField(field);
  }
}

function validateForm(): boolean {
  return fieldOrder
    .map((field: keyof SubjectValidationErrorsDTO): boolean => validateField(field))
    .every(Boolean);
}

function handleSubmit(): void {
  associationError.value = semesterId.value ? '' : 'Selecciona un semestre.';
  submissionAttempted.value = true;

  if (!validateForm() || associationError.value) {
    return;
  }

  emit('submit', { ...form.value }, semesterId.value);
}

function handleCancel(): void {
  emit('cancel');
}
</script>

<template>
  <form
    class="subject-form"
    novalidate
    :aria-label="isEditing ? 'Editar materia' : 'Crear materia'"
    @submit.prevent="handleSubmit"
  >
    <div v-if="submissionAttempted && hasValidationErrors" class="subject-form__alert" role="alert">
      Revisa los datos de la materia antes de continuar.
    </div>

    <label class="subject-form__field">
      <span>Semestre</span>
      <select v-model="semesterId" required :disabled="isEditing">
        <option :value="0">Selecciona un semestre</option>
        <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
          {{ semester.name }}
        </option>
      </select>
      <small v-if="associationError">{{ associationError }}</small>
    </label>

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
        @blur="validateField('professor')"
        @input="revalidateField('professor')"
      />
      <small v-if="errors.professor">{{ errors.professor }}</small>
    </label>

    <footer class="subject-form__actions">
      <button class="button button--secondary" type="button" @click="handleCancel">Cancelar</button>
      <button class="button button--primary" type="submit">
        {{ isEditing ? 'Guardar cambios' : 'Crear materia' }}
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
