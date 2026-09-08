<script setup lang="ts">
// Internal imports
import SubjectCard from '@/components/subject/SubjectCard.vue';
import SubjectForm from '@/components/subject/SubjectForm.vue';
import type { CreateSubjectDTO, UpdateSubjectDTO } from '@/dtos/SubjectDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
// External imports
import { computed, onMounted, ref, shallowRef } from 'vue';

// View state
const semesters = shallowRef<SemesterInterface[]>([]);
const subjects = shallowRef<SubjectInterface[]>([]);
const editingSubject = shallowRef<SubjectInterface>();
const selectedSemesterId = ref<string>('');
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);

// Derived view state
const filteredSubjects = computed<SubjectInterface[]>((): SubjectInterface[] =>
  selectedSemesterId.value === ''
    ? subjects.value
    : subjects.value.filter(
        (subject: SubjectInterface): boolean => subject.semester.id === selectedSemesterId.value,
      ),
);

const subjectCountLabel = computed<string>((): string => {
  const count = filteredSubjects.value.length;
  return count === 1 ? '1 materia registrada' : `${count} materias registradas`;
});

const formTitle = computed<string>((): string =>
  editingSubject.value ? 'Editar materia' : 'Crear materia',
);

const selectedSemester = computed<SemesterInterface | undefined>(
  (): SemesterInterface | undefined =>
    semesters.value.find(
      (semester: SemesterInterface): boolean => semester.id === selectedSemesterId.value,
    ),
);

// Error handling
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

// Data loading
async function loadData(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const [loadedSemesters, loadedSubjects] = await Promise.all([
      SemesterService.findAllByCurrentUser(),
      SubjectService.findAllByCurrentUser(),
    ]);
    semesters.value = loadedSemesters;
    subjects.value = loadedSubjects;
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

// Form handlers
function openCreateForm(): void {
  if (semesters.value.length === 0) {
    errorMessage.value = 'Crea un semestre antes de registrar una materia.';
    return;
  }

  editingSubject.value = undefined;
  isFormOpen.value = true;
}

function openEditForm(subject: SubjectInterface): void {
  editingSubject.value = subject;
  isFormOpen.value = true;
}

function closeForm(): void {
  editingSubject.value = undefined;
  isFormOpen.value = false;
}

async function saveSubject(dto: CreateSubjectDTO): Promise<void> {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    if (editingSubject.value) {
      const updateDTO: UpdateSubjectDTO = { ...dto };
      const updatedSubject = await SubjectService.update(editingSubject.value.id, updateDTO);
      if (!updatedSubject) {
        throw new Error('La materia que intentas editar ya no existe.');
      }
    } else {
      if (selectedSemester.value === undefined) {
        throw new Error('Selecciona un semestre antes de crear la materia.');
      }
      await SubjectService.create(dto, selectedSemester.value.id);
    }

    await loadData();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteSubject(subjectId: string): Promise<void> {
  const subject = subjects.value.find(
    (currentSubject: SubjectInterface): boolean => currentSubject.id === subjectId,
  );

  if (
    !window.confirm(
      `¿Eliminar ${subject?.name ?? 'esta materia'}? Esta acción no se puede deshacer.`,
    )
  ) {
    return;
  }

  try {
    const wasDeleted = await SubjectService.delete(subjectId);
    if (!wasDeleted) {
      throw new Error('La materia que intentas eliminar ya no existe.');
    }
    await loadData();
    if (editingSubject.value?.id === subjectId) {
      closeForm();
    }
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  }
}

onMounted(loadData);
</script>

<template>
  <section class="subject-page" aria-labelledby="subject-title">
    <header class="subject-page__header">
      <div>
        <p class="eyebrow">Organización académica</p>
        <h1 id="subject-title" class="page-title">Todas mis materias</h1>
        <p class="page-description">Consulta y administra tus materias desde un solo lugar.</p>
      </div>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Nueva materia
      </button>
    </header>

    <div class="subject-page__toolbar">
      <label for="semester-filter">Filtrar por semestre</label>
      <select id="semester-filter" v-model="selectedSemesterId">
        <option value="">Todos los semestres</option>
        <option v-for="semester in semesters" :key="semester.id" :value="semester.id">
          {{ semester.name }}
        </option>
      </select>
    </div>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <section v-if="isFormOpen" class="subject-page__form" aria-labelledby="subject-form-title">
      <div class="subject-page__form-heading">
        <div>
          <p class="eyebrow">{{ editingSubject ? 'Actualizar materia' : 'Nueva materia' }}</p>
          <h2 id="subject-form-title">{{ formTitle }}</h2>
        </div>
        <button
          class="subject-page__close"
          type="button"
          aria-label="Cerrar formulario"
          @click="closeForm"
        >
          ×
        </button>
      </div>
      <SubjectForm
        :key="editingSubject?.id ?? 'new-subject'"
        :loading="isSubmitting"
        :subject="editingSubject"
        @cancel="closeForm"
        @submit="saveSubject"
      />
    </section>

    <div class="subject-page__summary">
      <p>{{ subjectCountLabel }}</p>
    </div>

    <div v-if="isLoading" class="subject-grid" aria-label="Cargando materias" aria-busy="true">
      <div v-for="index in 2" :key="index" class="subject-skeleton"></div>
    </div>
    <div v-else-if="filteredSubjects.length" class="subject-grid">
      <SubjectCard
        v-for="subject in filteredSubjects"
        :key="subject.id"
        :subject="subject"
        @delete="deleteSubject"
        @edit="openEditForm"
      />
    </div>
    <div v-else class="subject-empty">
      <span aria-hidden="true">◇</span>
      <h2>No hay materias para este filtro</h2>
      <p>Selecciona otro semestre o registra una nueva materia.</p>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Crear materia
      </button>
    </div>
  </section>
</template>

<style scoped>
.subject-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}
.subject-page__toolbar {
  display: grid;
  grid-template-columns: auto minmax(12rem, 20rem);
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.subject-page__toolbar label {
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}
.subject-page__toolbar select {
  min-height: 2.8rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
}
.subject-page > .status-message {
  margin-top: 1.5rem;
}
.subject-page__form {
  max-width: 48rem;
  margin-top: 2rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid rgba(25, 51, 44, 0.1);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
.subject-page__form-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.subject-page__form-heading h2 {
  margin: 0;
  font-family: var(--font-display);
}
.subject-page__close {
  border: 0;
  background: transparent;
  color: var(--color-muted);
  font-size: 1.7rem;
}
.subject-page__summary {
  margin: 2.5rem 0 1rem;
  color: var(--color-muted);
  font-weight: 700;
}
.subject-page__summary p {
  margin: 0;
}
.subject-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.15rem;
}
.subject-skeleton {
  min-height: 14rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-border) 60%, transparent);
}
.subject-empty {
  padding: 3rem 1.5rem;
  border: 1px dashed var(--color-border);
  border-radius: 1.2rem;
  text-align: center;
}
.subject-empty > span {
  color: var(--color-highlight);
  font-size: 2rem;
}
.subject-empty h2,
.subject-empty p {
  margin: 0.6rem 0 0;
}
.subject-empty p {
  color: var(--color-muted);
}
.subject-empty .button {
  margin-top: 1.5rem;
}
@media (max-width: 700px) {
  .subject-page__header {
    display: grid;
    align-items: start;
  }
  .subject-page__toolbar {
    grid-template-columns: 1fr;
  }
  .subject-grid {
    grid-template-columns: 1fr;
  }
}
</style>
