<script setup lang="ts">
// Internal imports
import UserForm from '@/components/admin/UserForm.vue';
import type { CreateUserDTO } from '@/dtos/UserDTOs.js';
import type { Role, UserInterface } from '@/interfaces/UserInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { UserService } from '@/services/UserService.js';
import { ErrorUtil } from '@/utils/ErrorUtil.js';
import { TableRenderUtil } from '@/utils/TableRenderUtil.js';

// External imports
import DataTable from 'datatables.net-vue3';
import { computed, ref } from 'vue';

// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const users = ref<UserInterface[]>([...UserService.getUsers()]);
const editingUser = ref<UserInterface>();
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);
const tableColumns = [
  {
    data: 'name',
    render: (name: string): string => TableRenderUtil.renderText(name),
    title: 'Nombre',
  },
  {
    data: 'email',
    render: (email: string): string => TableRenderUtil.renderText(email),
    title: 'Correo',
  },
  {
    data: 'role',
    render: (role: Role): string => TableRenderUtil.renderRole(role),
    title: 'Rol',
  },
  {
    data: null,
    orderable: false,
    render: (_data: null, _type: string, user: UserInterface): string => `
      <div class="user-table__actions">
        <button type="button" data-action="edit" data-user-id="${user.id}">Editar</button>
        <button type="button" data-action="delete" data-user-id="${user.id}">Eliminar</button>
      </div>
    `,
    searchable: false,
    title: 'Acciones',
  },
];

// Computed
const userCountLabel = computed<string>((): string => {
  const count = users.value.length;

  return count === 1 ? '1 usuario registrado' : `${count} usuarios registrados`;
});

const formTitle = computed<string>((): string =>
  editingUser.value ? 'Editar usuario' : 'Crear usuario',
);

// Functions
function loadUsers(): void {
  users.value = [...UserService.getUsers()];
}

function openCreateForm(): void {
  editingUser.value = undefined;
  isFormOpen.value = true;
}

function openEditForm(user: UserInterface): void {
  editingUser.value = user;
  isFormOpen.value = true;
}

function closeForm(): void {
  editingUser.value = undefined;
  isFormOpen.value = false;
}

function handleTableClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) {
    return;
  }

  const actionButton = event.target.closest<HTMLButtonElement>('[data-action]');
  const userId = Number(actionButton?.dataset.userId);
  const action = actionButton?.dataset.action;

  if (action === 'edit') {
    const user = UserService.getUserById(userId);

    if (user) {
      openEditForm(user);
    }
  }

  if (action === 'delete') {
    deleteUser(userId);
  }
}

function saveUser(dto: CreateUserDTO): void {
  errorMessage.value = '';

  try {
    if (editingUser.value) {
      if (!UserService.updateUser(editingUser.value.id, dto)) {
        throw new Error('El usuario que intentas editar ya no existe.');
      }
    } else {
      UserService.createUser(dto);
    }

    loadUsers();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = ErrorUtil.getErrorMessage(error);
  }
}

function deleteUser(userId: number): void {
  if (userId === loggedUserId) {
    errorMessage.value = 'No puedes eliminar tu propia cuenta mientras tienes la sesión abierta.';
    return;
  }

  const user = UserService.getUserById(userId);

  if (
    !window.confirm(
      `¿Eliminar a ${user?.name ?? 'este usuario'}? Esta acción no se puede deshacer.`,
    )
  ) {
    return;
  }

  errorMessage.value = '';

  if (!UserService.deleteUser(userId)) {
    errorMessage.value = 'El usuario que intentas eliminar ya no existe.';
  }

  loadUsers();

  if (editingUser.value?.id === userId) {
    closeForm();
  }
}
</script>

<template>
  <section class="admin-users-page" aria-labelledby="admin-users-title">
    <header class="admin-users-page__header">
      <div>
        <p class="eyebrow">Administración</p>
        <h1 id="admin-users-title" class="page-title">Usuarios de la plataforma</h1>
        <p class="page-description">
          Crea, edita y elimina cuentas. El correo de cada usuario debe ser único.
        </p>
      </div>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Nuevo usuario
      </button>
    </header>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <section
      v-if="isFormOpen"
      class="admin-users-page__form"
      aria-labelledby="admin-users-form-title"
    >
      <div class="admin-users-page__form-heading">
        <div>
          <p class="eyebrow">{{ editingUser ? 'Actualizar usuario' : 'Nuevo usuario' }}</p>
          <h2 id="admin-users-form-title">{{ formTitle }}</h2>
        </div>
        <button
          class="admin-users-page__close"
          type="button"
          aria-label="Cerrar formulario"
          @click="closeForm"
        >
          ×
        </button>
      </div>
      <UserForm
        :key="editingUser?.id ?? 'new-user'"
        :user="editingUser"
        @cancel="closeForm"
        @submit="saveUser"
      />
    </section>

    <div class="admin-users-page__summary">
      <p>{{ userCountLabel }}</p>
    </div>
    <div v-if="users.length" class="admin-users-table-wrap" @click="handleTableClick">
      <DataTable
        :data="users"
        :columns="tableColumns"
        :options="{
          language: {
            emptyTable: 'No hay usuarios registrados.',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ usuarios',
            infoEmpty: 'No hay usuarios para mostrar',
            lengthMenu: 'Mostrar _MENU_ usuarios',
            search: 'Buscar:',
            zeroRecords: 'No se encontraron usuarios.',
          },
          order: [[0, 'asc']],
          pageLength: 10,
        }"
        class="display admin-users-table"
      />
    </div>
    <div v-else class="admin-users-empty">
      <span aria-hidden="true">◇</span>
      <h2>Todavía no hay usuarios</h2>
      <p>Crea el primer usuario de la plataforma.</p>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Crear usuario
      </button>
    </div>
  </section>
</template>

<style scoped>
.admin-users-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}
.admin-users-page > .status-message {
  margin-top: 1.5rem;
}
.admin-users-page__form {
  max-width: 48rem;
  margin-top: 2rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid rgba(25, 51, 44, 0.1);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
.admin-users-page__form-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.admin-users-page__form-heading h2 {
  margin: 0;
  font-family: var(--font-display);
}
.admin-users-page__close {
  border: 0;
  background: transparent;
  color: var(--color-muted);
  font-size: 1.7rem;
}
.admin-users-page__summary {
  margin: 2.5rem 0 1rem;
  color: var(--color-muted);
  font-weight: 700;
}
.admin-users-page__summary p {
  margin: 0;
}
.admin-users-table-wrap {
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.admin-users-table :deep(.user-table__actions) {
  display: flex;
  gap: 0.45rem;
}
.admin-users-table :deep(.user-table__actions button) {
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
  color: var(--color-ink);
  cursor: pointer;
}
.admin-users-empty {
  padding: 3rem 1.5rem;
  border: 1px dashed var(--color-border);
  border-radius: 1.2rem;
  text-align: center;
}
.admin-users-empty > span {
  color: var(--color-highlight);
  font-size: 2rem;
}
.admin-users-empty h2,
.admin-users-empty p {
  margin: 0.6rem 0 0;
}
.admin-users-empty p {
  color: var(--color-muted);
}
.admin-users-empty .button {
  margin-top: 1.5rem;
}
@media (max-width: 700px) {
  .admin-users-page__header {
    display: grid;
    align-items: start;
  }
}
</style>
