<script setup lang="ts">
// Internal imports
import GradeCard from '@/components/grade/GradeCard.vue';
import GradeForm from '@/components/grade/GradeForm.vue';
import type { CreateGradeDTO, UpdateGradeDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { SubjectService } from '@/services/SubjectService.js';
// External imports
import { computed, onMounted, ref, shallowRef } from 'vue';

// View state
const subjects = shallowRef<SubjectInterface[]>([]);
const grades = shallowRef<GradeInterface[]>([]);
const editingGrade = shallowRef<GradeInterface>();
const selectedSubjectId = ref<string>('');
const errorMessage = ref<string>('');
const isFormOpen = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const isSubmitting = ref<boolean>(false);

// Derived view state
const filteredGrades = computed<GradeInterface[]>((): GradeInterface[] =>
  selectedSubjectId.value === ''
    ? grades.value
    : grades.value.filter(
        (grade: GradeInterface): boolean => grade.subject.id === selectedSubjectId.value,
      ),
);
const gradeCountLabel = computed<string>((): string => {
  const count = filteredGrades.value.length;
  return count === 1 ? '1 nota registrada' : `${count} notas registradas`;
});
const formTitle = computed<string>((): string =>
  editingGrade.value ? 'Editar nota' : 'Crear nota',
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
    const [loadedSubjects, loadedGrades] = await Promise.all([
      SubjectService.findAllByCurrentUser(),
      GradeService.findAllByCurrentUser(),
    ]);
    subjects.value = loadedSubjects;
    grades.value = loadedGrades;
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

// Form handlers
function openCreateForm(): void {
  if (subjects.value.length === 0) {
    errorMessage.value = 'Crea una materia antes de registrar una nota.';
    return;
  }
  editingGrade.value = undefined;
  isFormOpen.value = true;
}

function openEditForm(grade: GradeInterface): void {
  editingGrade.value = grade;
  isFormOpen.value = true;
}

function closeForm(): void {
  editingGrade.value = undefined;
  isFormOpen.value = false;
}

async function saveGrade(dto: CreateGradeDTO, subjectId: string): Promise<void> {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    if (editingGrade.value) {
      const updatedGrade = await GradeService.update(editingGrade.value.id, dto as UpdateGradeDTO);
      if (!updatedGrade) throw new Error('La nota que intentas editar ya no existe.');
    } else {
      await GradeService.create(dto, subjectId);
    }
    await loadData();
    closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteGrade(gradeId: string): Promise<void> {
  const grade = grades.value.find(
    (currentGrade: GradeInterface): boolean => currentGrade.id === gradeId,
  );
  if (
    !window.confirm(`¿Eliminar ${grade?.title ?? 'esta nota'}? Esta acción no se puede deshacer.`)
  ) {
    return;
  }

  try {
    if (!(await GradeService.delete(gradeId))) {
      throw new Error('La nota que intentas eliminar ya no existe.');
    }
    await loadData();
    if (editingGrade.value?.id === gradeId) closeForm();
  } catch (error: unknown) {
    errorMessage.value = getErrorMessage(error);
  }
}

onMounted(loadData);
</script>

<template>
  <section class="grade-page" aria-labelledby="grade-title">
    <header class="grade-page__header">
      <div>
        <p class="eyebrow">Evaluación académica</p>
        <h1 id="grade-title" class="page-title">Todas mis notas</h1>
        <p class="page-description">Consulta y administra tus notas desde un solo lugar.</p>
      </div>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Nueva nota
      </button>
    </header>

    <div class="grade-page__toolbar">
      <label for="subject-filter">Filtrar por materia</label>
      <select id="subject-filter" v-model="selectedSubjectId">
        <option value="">Todas las materias</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.code }} · {{ subject.name }}
        </option>
      </select>
    </div>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <section v-if="isFormOpen" class="grade-page__form" aria-labelledby="grade-form-title">
      <div class="grade-page__form-heading">
        <div>
          <p class="eyebrow">{{ editingGrade ? 'Actualizar nota' : 'Nueva nota' }}</p>
          <h2 id="grade-form-title">{{ formTitle }}</h2>
        </div>
        <button
          class="grade-page__close"
          type="button"
          aria-label="Cerrar formulario"
          @click="closeForm"
        >
          ×
        </button>
      </div>
      <GradeForm
        :key="editingGrade?.id ?? 'new-grade'"
        :grade="editingGrade"
        :loading="isSubmitting"
        :subjects="subjects"
        @cancel="closeForm"
        @submit="saveGrade"
      />
    </section>

    <div class="grade-page__summary">
      <p>{{ gradeCountLabel }}</p>
    </div>
    <div v-if="isLoading" class="grade-grid" aria-label="Cargando notas" aria-busy="true">
      <div v-for="index in 2" :key="index" class="grade-skeleton"></div>
    </div>
    <div v-else-if="filteredGrades.length" class="grade-grid">
      <GradeCard
        v-for="grade in filteredGrades"
        :key="grade.id"
        :grade="grade"
        @delete="deleteGrade"
        @edit="openEditForm"
      />
    </div>
    <div v-else class="grade-empty">
      <span aria-hidden="true">◇</span>
      <h2>No hay notas para este filtro</h2>
      <p>Selecciona otra materia o registra una nueva nota.</p>
      <button class="button button--primary" type="button" @click="openCreateForm">
        Crear nota
      </button>
    </div>
  </section>
</template>

<style scoped>
.grade-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}
.grade-page__toolbar {
  display: grid;
  grid-template-columns: auto minmax(12rem, 28rem);
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.grade-page__toolbar label {
  color: var(--color-ink);
  font-size: 0.86rem;
  font-weight: 700;
}
.grade-page__toolbar select {
  min-height: 2.8rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
}
.grade-page > .status-message {
  margin-top: 1.5rem;
}
.grade-page__form {
  max-width: 48rem;
  margin-top: 2rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid rgba(25, 51, 44, 0.1);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}
.grade-page__form-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.grade-page__form-heading h2 {
  margin: 0;
  font-family: var(--font-display);
}
.grade-page__close {
  border: 0;
  background: transparent;
  color: var(--color-muted);
  font-size: 1.7rem;
}
.grade-page__summary {
  margin: 2.5rem 0 1rem;
  color: var(--color-muted);
  font-weight: 700;
}
.grade-page__summary p {
  margin: 0;
}
.grade-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.15rem;
}
.grade-skeleton {
  min-height: 16rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-border) 60%, transparent);
}
.grade-empty {
  padding: 3rem 1.5rem;
  border: 1px dashed var(--color-border);
  border-radius: 1.2rem;
  text-align: center;
}
.grade-empty > span {
  color: var(--color-highlight);
  font-size: 2rem;
}
.grade-empty h2,
.grade-empty p {
  margin: 0.6rem 0 0;
}
.grade-empty p {
  color: var(--color-muted);
}
.grade-empty .button {
  margin-top: 1.5rem;
}
@media (max-width: 700px) {
  .grade-page__header {
    display: grid;
    align-items: start;
  }
  .grade-page__toolbar {
    grid-template-columns: 1fr;
  }
  .grade-grid {
    grid-template-columns: 1fr;
  }
}
</style>
