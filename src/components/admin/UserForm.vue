<script setup lang="ts">
// Internal imports
import type { CreateUserDTO, UserValidationErrorsDTO } from '@/dtos/UserDTOs.js';
import { Role, type UserInterface } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';

// External imports
import { computed, ref, useId } from 'vue';

// Props
const props = defineProps<{ user?: UserInterface }>();

// Emits
const emit = defineEmits<{
  cancel: [];
  submit: [user: CreateUserDTO];
}>();

// State
const formId = useId();
const nameInputId = `${formId}-name`;
const emailInputId = `${formId}-email`;
const passwordInputId = `${formId}-password`;
const roleInputId = `${formId}-role`;
const fieldOrder: (keyof UserValidationErrorsDTO)[] = ['name', 'email', 'password'];
const form = ref<CreateUserDTO>({
  email: props.user?.email ?? '',
  name: props.user?.name ?? '',
  password: props.user?.password ?? '',
  role: props.user?.role ?? Role.User,
});
const errors = ref<UserValidationErrorsDTO>({ email: '', name: '', password: '' });
const touched = ref<Record<keyof UserValidationErrorsDTO, boolean>>({
  email: false,
  name: false,
  password: false,
});
const submissionAttempted = ref<boolean>(false);

// Computed
const isEditing = computed<boolean>((): boolean => props.user !== undefined);

const hasValidationErrors = computed<boolean>((): boolean =>
  fieldOrder.some((field: keyof UserValidationErrorsDTO): boolean => errors.value[field] !== ''),
);

// Functions
function validateField(field: keyof UserValidationErrorsDTO): boolean {
  touched.value[field] = true;
  errors.value[field] = UserService.validateFields(form.value, props.user?.id)[field];

  return errors.value[field] === '';
}

function revalidateField(field: keyof UserValidationErrorsDTO): void {
  if (touched.value[field] || submissionAttempted.value) {
    validateField(field);
  }
}

function validateForm(): boolean {
  return fieldOrder
    .map((field: keyof UserValidationErrorsDTO): boolean => validateField(field))
    .every(Boolean);
}

function handleSubmit(): void {
  submissionAttempted.value = true;

  if (!validateForm()) {
    return;
  }

  emit('submit', { ...form.value });
}

function handleCancel(): void {
  emit('cancel');
}
</script>

<template>
  <form class="user-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="submissionAttempted && hasValidationErrors" class="user-form__alert" role="alert">
      Revisa los datos del usuario antes de continuar.
    </div>

    <div class="user-form__grid">
      <label class="user-form__field" :for="nameInputId">
        <span>Nombre</span>
        <input
          :id="nameInputId"
          v-model="form.name"
          type="text"
          required
          @blur="validateField('name')"
          @input="revalidateField('name')"
        />
        <small v-if="errors.name">{{ errors.name }}</small>
      </label>
      <label class="user-form__field" :for="emailInputId">
        <span>Correo</span>
        <input
          :id="emailInputId"
          v-model="form.email"
          type="email"
          required
          @blur="validateField('email')"
          @input="revalidateField('email')"
        />
        <small v-if="errors.email">{{ errors.email }}</small>
      </label>
    </div>

    <div class="user-form__grid">
      <label class="user-form__field" :for="passwordInputId">
        <span>Contraseña</span>
        <input
          :id="passwordInputId"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          required
          @blur="validateField('password')"
          @input="revalidateField('password')"
        />
        <small v-if="errors.password">{{ errors.password }}</small>
      </label>
      <label class="user-form__field" :for="roleInputId">
        <span>Rol</span>
        <select :id="roleInputId" v-model="form.role">
          <option :value="Role.User">Estudiante</option>
          <option :value="Role.Admin">Administrador</option>
        </select>
      </label>
    </div>

    <footer class="user-form__actions">
      <button class="button button--secondary" type="button" @click="handleCancel">Cancelar</button>
      <button class="button button--primary" type="submit">
        {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
      </button>
    </footer>
  </form>
</template>

<style scoped>
.user-form {
  display: grid;
  gap: 1.1rem;
}
.user-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.user-form__field {
  display: grid;
  gap: 0.4rem;
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}
.user-form__field input,
.user-form__field select {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-white);
  color: var(--color-ink);
  font: inherit;
}
.user-form__field input:focus,
.user-form__field select:focus {
  border-color: var(--color-accent);
  outline: 3px solid rgba(35, 107, 86, 0.16);
}
.user-form__field small {
  color: var(--color-danger);
  font-weight: 600;
}
.user-form__alert {
  padding: 0.8rem 0.9rem;
  border-radius: 0.7rem;
  background: var(--color-danger-light);
  color: var(--color-danger);
}
.user-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
}
@media (max-width: 40rem) {
  .user-form__grid {
    grid-template-columns: 1fr;
  }
  .user-form__actions {
    flex-direction: column-reverse;
  }
  .user-form__actions .button {
    width: 100%;
  }
}
</style>
