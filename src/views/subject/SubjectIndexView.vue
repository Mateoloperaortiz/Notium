<script setup lang="ts">
// Internal imports
import SubjectCard from '@/components/subject/SubjectCard.vue';
import SubjectForm from '@/components/subject/SubjectForm.vue';
import type { CreateSubjectDTO } from '@/dtos/SubjectDTOs.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { ErrorUtil } from '@/utils/ErrorUtil.js';

// External imports
import { computed, ref } from 'vue';

// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const semesters = SemesterService.getSemestersByUserId(loggedUserId);
const subjects = ref<SubjectInterface[]>(SubjectService.getSubjectsBySemesters(semesters));
const editingSubject = ref<SubjectInterface>();
const selectedSemesterId = ref<number>(0);
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);

// Computed
const filteredSubjects = computed<SubjectInterface[]>((): SubjectInterface[] =>
  selectedSemesterId.value === 0
    ? subjects.value
    : subjects.value.filter(
        (subject: SubjectInterface): boolean => subject.semesterId === selectedSemesterId.value,
      ),
);

const subjectCountLabel = computed<string>((): string => {
  const count = filteredSubjects.value.length;

  return count === 1 ? '1 materia registrada' : `${count} materias registradas`;
});

const formTitle = computed<string>((): string =>
  editingSubject.value ? 'Editar materia' : 'Crear materia',
);

// Functions
function loadSubjects(): void {
  subjects.value = SubjectService.getSubjectsBySemesters(semesters);
}

function openCreateForm(): void {
  if (semesters.length === 0) {
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

function saveSubject(dto: CreateSubjectDTO, semesterId: number): void {
  errorMessage.value = '';

  try {
    if (editingSubject.value) {
      if (!SubjectService.updateSubject(editingSubject.value.id, dto)) {
        throw new Error('La materia que intentas editar ya no existe.');
      }
    } else {
      SubjectService.createSubject(dto, semesterId);
    }

    loadSubjects();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = ErrorUtil.getErrorMessage(error);
  }
}

function deleteSubject(subjectId: number): void {
  const subject = SubjectService.getSubjectById(subjectId);

  if (
    !window.confirm(
      `¿Eliminar ${subject?.name ?? 'esta materia'}? Esta acción no se puede deshacer.`,
    )
  ) {
    return;
  }

  errorMessage.value = '';

  if (!SubjectService.deleteSubject(subjectId)) {
    errorMessage.value = 'La materia que intentas eliminar ya no existe.';
  }

  loadSubjects();

  if (editingSubject.value?.id === subjectId) {
    closeForm();
  }
}
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
        <option :value="0">Todos los semestres</option>
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
        :semesters="semesters"
        :subject="editingSubject"
        @cancel="closeForm"
        @submit="saveSubject"
      />
    </section>

    <div class="subject-page__summary">
      <p>{{ subjectCountLabel }}</p>
    </div>

    <div v-if="filteredSubjects.length" class="subject-grid">
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
