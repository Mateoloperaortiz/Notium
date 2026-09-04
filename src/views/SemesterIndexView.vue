<script setup lang="ts">
import SemesterCard from '@/components/semester/SemesterCard.vue';
import SemesterForm from '@/components/semester/SemesterForm.vue';
import type CreateSemesterDTO from '@/dtos/CreateSemesterDTO.js';
import type UpdateSemesterDTO from '@/dtos/UpdateSemesterDTO.js';
import type Semester from '@/models/Semester.js';
import { semesterService } from '@/services/SemesterService.js';
import { computed, onMounted, ref, shallowRef } from 'vue';

const semesters = shallowRef<Semester[]>([]);
const editingSemester = shallowRef<Semester>();
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);

const semesterCountLabel = computed<string>((): string => {
  const count = semesters.value.length;

  return count === 1 ? '1 semestre registrado' : `${count} semestres registrados`;
});

const formTitle = computed<string>((): string =>
  editingSemester.value ? 'Editar semestre' : 'Crear semestre',
);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

async function loadSemesters(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    semesters.value = await semesterService.findAll();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

function openCreateForm(): void {
  editingSemester.value = undefined;
  isFormOpen.value = true;
}

function openEditForm(semester: Semester): void {
  editingSemester.value = semester;
  isFormOpen.value = true;
}

function closeForm(): void {
  editingSemester.value = undefined;
  isFormOpen.value = false;
}

async function saveSemester(dto: CreateSemesterDTO): Promise<void> {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    if (editingSemester.value) {
      const updateDTO: UpdateSemesterDTO = {
        endDate: dto.endDate,
        name: dto.name,
        startDate: dto.startDate,
      };
      const updatedSemester = await semesterService.update(
        editingSemester.value.getId(),
        updateDTO,
      );

      if (!updatedSemester) {
        throw new Error('El semestre que intentas editar ya no existe.');
      }
    } else {
      await semesterService.create(dto);
    }

    await loadSemesters();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteSemester(semesterId: string): Promise<void> {
  const semester = semesters.value.find(
    (currentSemester: Semester): boolean => currentSemester.getId() === semesterId,
  );
  const semesterName = semester?.getName() ?? 'este semestre';

  if (!window.confirm(`¿Eliminar ${semesterName}? Esta acción no se puede deshacer.`)) {
    return;
  }

  errorMessage.value = '';

  try {
    const wasDeleted = await semesterService.delete(semesterId);

    if (!wasDeleted) {
      throw new Error('El semestre que intentas eliminar ya no existe.');
    }

    await loadSemesters();

    if (editingSemester.value?.getId() === semesterId) {
      closeForm();
    }
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  }
}

onMounted(loadSemesters);
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
        :key="editingSemester?.getId() ?? 'new-semester'"
        :loading="isSubmitting"
        :semester="editingSemester"
        @cancel="closeForm"
        @submit="saveSemester"
      />
    </section>

    <div class="semester-page__summary">
      <p>{{ semesterCountLabel }}</p>
      <span aria-hidden="true"></span>
    </div>

    <div v-if="isLoading" class="semester-grid" aria-label="Cargando semestres" aria-busy="true">
      <div v-for="index in 2" :key="index" class="semester-skeleton"></div>
    </div>

    <div v-else-if="semesters.length" class="semester-grid">
      <SemesterCard
        v-for="semester in semesters"
        :key="semester.getId()"
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

.semester-skeleton {
  min-height: 16rem;
  border-radius: 1.25rem;
  background: linear-gradient(105deg, #eeece5 25%, #faf8f1 40%, #eeece5 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
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

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
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
