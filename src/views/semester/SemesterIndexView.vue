<script setup lang="ts">
// Internal imports
import SemesterCard from '@/components/semester/SemesterCard.vue';
import SemesterForm from '@/components/semester/SemesterForm.vue';
import type { CreateSemesterDTO } from '@/dtos/SemesterDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { SemesterService } from '@/services/SemesterService.js';

// External imports
import { computed, ref } from 'vue';

// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const semesters = ref<SemesterInterface[]>(SemesterService.getSemestersByUserId(loggedUserId));
const editingSemester = ref<SemesterInterface>();
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);

// Computed
const semesterCountLabel = computed<string>((): string => {
  const count = semesters.value.length;

  return count === 1 ? '1 semestre registrado' : `${count} semestres registrados`;
});

const formTitle = computed<string>((): string =>
  editingSemester.value ? 'Editar semestre' : 'Crear semestre',
);

// Functions
function loadSemesters(): void {
  semesters.value = SemesterService.getSemestersByUserId(loggedUserId);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

function openCreateForm(): void {
  editingSemester.value = undefined;
  isFormOpen.value = true;
}

function openEditForm(semester: SemesterInterface): void {
  editingSemester.value = semester;
  isFormOpen.value = true;
}

function closeForm(): void {
  editingSemester.value = undefined;
  isFormOpen.value = false;
}

function saveSemester(dto: CreateSemesterDTO): void {
  errorMessage.value = '';

  try {
    if (editingSemester.value) {
      if (!SemesterService.updateSemester(editingSemester.value.id, dto)) {
        throw new Error('El semestre que intentas editar ya no existe.');
      }
    } else {
      SemesterService.createSemester(dto, loggedUserId);
    }

    loadSemesters();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  }
}

function deleteSemester(semesterId: number): void {
  const semester = SemesterService.getSemesterById(semesterId);

  if (
    !window.confirm(
      `¿Eliminar ${semester?.name ?? 'este semestre'}? Esta acción no se puede deshacer.`,
    )
  ) {
    return;
  }

  errorMessage.value = '';

  if (!SemesterService.deleteSemester(semesterId)) {
    errorMessage.value = 'El semestre que intentas eliminar ya no existe.';
  }

  loadSemesters();

  if (editingSemester.value?.id === semesterId) {
    closeForm();
  }
}
</script>

<template>
  <section class="semester-page" aria-labelledby="semester-title">
    <header class="semester-page__header">
      <div>
        <p class="eyebrow">Planeación académica</p>
        <h1 id="semester-title" class="page-title">Mis semestres</h1>
        <p class="page-description">
          Crea una vista clara de tu recorrido académico, un periodo a la vez.
        </p>
      </div>

      <button class="button button--primary" type="button" @click="openCreateForm">
        <span aria-hidden="true">＋</span>
        Nuevo semestre
      </button>
    </header>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <section v-if="isFormOpen" class="semester-page__form" :aria-labelledby="'semester-form-title'">
      <div class="semester-page__form-heading">
        <div>
          <p class="eyebrow">{{ editingSemester ? 'Actualizar periodo' : 'Nuevo periodo' }}</p>
          <h2 id="semester-form-title">{{ formTitle }}</h2>
        </div>
        <button
          class="semester-page__close"
          type="button"
          aria-label="Cerrar formulario"
          @click="closeForm"
        >
          ×
        </button>
      </div>

      <SemesterForm
        :key="editingSemester?.id ?? 'new-semester'"
        :semester="editingSemester"
        @cancel="closeForm"
        @submit="saveSemester"
      />
    </section>

    <div class="semester-page__summary">
      <p>{{ semesterCountLabel }}</p>
      <span aria-hidden="true"></span>
    </div>

    <div v-if="semesters.length" class="semester-grid">
      <SemesterCard
        v-for="semester in semesters"
        :key="semester.id"
        :semester="semester"
        @delete="deleteSemester"
        @edit="openEditForm"
      />
    </div>

    <div v-else class="semester-empty">
      <span class="semester-empty__icon" aria-hidden="true">◇</span>
      <h2>Aún no tienes semestres</h2>
      <p>Crea el primero y empieza a darle estructura a tu recorrido académico.</p>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Crear mi primer semestre
      </button>
    </div>
  </section>
</template>

<style scoped>
.semester-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}

.semester-page__header .button {
  flex: 0 0 auto;
  gap: 0.5rem;
}

.semester-page > .status-message {
  margin-top: 1.5rem;
}

.semester-page__form {
  max-width: 48rem;
  margin-top: 2rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid rgba(25, 51, 44, 0.1);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.semester-page__form-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.semester-page__form-heading h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.55rem;
  letter-spacing: -0.035em;
}

.semester-page__form-heading .eyebrow {
  margin-bottom: 0.3rem;
}

.semester-page__close {
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 50%;
  background: #f0eee8;
  color: var(--color-muted);
  font-size: 1.45rem;
  line-height: 1;
}

.semester-page__summary {
  display: flex;
  align-items: center;
  margin: 3rem 0 1.1rem;
  gap: 1rem;
}

.semester-page__summary p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.semester-page__summary span {
  width: 100%;
  height: 1px;
  background: var(--color-border);
}

.semester-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.15rem;
}

.semester-empty {
  padding: 4rem 1.5rem;
  border: 1px dashed #bcc9c1;
  border-radius: 1.3rem;
  background: rgba(255, 253, 248, 0.55);
  text-align: center;
}

.semester-empty__icon {
  display: grid;
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1rem;
  place-items: center;
  border-radius: 1rem;
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 1.5rem;
}

.semester-empty h2 {
  margin: 0;
  font-family: var(--font-display);
}

.semester-empty p {
  margin: 0.55rem auto 1.5rem;
  color: var(--color-muted);
}

@media (max-width: 720px) {
  .semester-page__header {
    align-items: start;
    flex-direction: column;
  }

  .semester-grid {
    grid-template-columns: 1fr;
  }
}
</style>
