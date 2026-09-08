<script setup lang="ts">
// Internal imports
import GradeCard from '@/components/grade/GradeCard.vue';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { SubjectService } from '@/services/SubjectService.js';
// External imports
import { computed, ref, shallowRef, watch } from 'vue';
import { RouterLink } from 'vue-router';

// Interfaces and types
interface Props {
  semesterId: string;
  subjectId: string;
}

// Props
const props = defineProps<Props>();

// View state
const subject = shallowRef<SubjectInterface>();
const grades = shallowRef<GradeInterface[]>([]);
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(true);
const gradeCount = computed<number>((): number => grades.value.length);

// Data loading
async function loadSubject(subjectId: string): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    subject.value = await SubjectService.findById(subjectId);
    grades.value = subject.value ? await GradeService.findBySubjectId(subjectId) : [];
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No fue posible cargar la materia.';
    subject.value = undefined;
    grades.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(
  (): string => props.subjectId,
  (subjectId: string): void => {
    void loadSubject(subjectId);
  },
  { immediate: true },
);
</script>

<template>
  <section class="subject-detail" aria-labelledby="subject-detail-title">
    <RouterLink
      class="subject-detail__back"
      :to="{ name: 'subject-index', params: { semesterId } }"
    >
      <span aria-hidden="true">←</span>
      Volver a materias
    </RouterLink>

    <div v-if="isLoading" class="subject-detail__loading" aria-busy="true">Cargando materia...</div>
    <p v-else-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <div v-else-if="subject">
      <header class="subject-detail__hero">
        <div>
          <p class="eyebrow">{{ subject.code }}</p>
          <h1 id="subject-detail-title" class="page-title">{{ subject.name }}</h1>
          <p class="subject-detail__professor">Profesor: {{ subject.professor }}</p>
        </div>
        <div class="subject-detail__metric" aria-label="Créditos de la materia">
          <strong>{{ subject.credits }}</strong>
          <span>créditos</span>
        </div>
      </header>

      <section class="subject-detail__grades" aria-labelledby="grades-title">
        <p class="eyebrow">Evaluación</p>
        <h2 id="grades-title">Notas de la materia</h2>
        <p>{{ gradeCount }} {{ gradeCount === 1 ? 'nota registrada' : 'notas registradas' }}.</p>
        <div v-if="grades.length" class="subject-detail__grade-list">
          <GradeCard v-for="grade in grades" :key="grade.id" :grade="grade" :show-actions="false" />
        </div>
        <p v-else class="subject-detail__empty-grades">Aún no hay notas registradas.</p>
        <RouterLink class="button button--primary" :to="{ name: 'grade-index' }">
          Ver todas las notas
        </RouterLink>
      </section>
    </div>

    <div v-else class="subject-detail__not-found">
      <span aria-hidden="true">404</span>
      <h1 id="subject-detail-title">No encontramos esta materia</h1>
      <p>Puede que haya sido eliminada o que el enlace no sea correcto.</p>
      <RouterLink
        class="button button--primary"
        :to="{ name: 'subject-index', params: { semesterId } }"
        >Volver a materias</RouterLink
      >
    </div>
  </section>
</template>

<style scoped>
.subject-detail__back {
  display: inline-flex;
  gap: 0.55rem;
  margin-bottom: 2.5rem;
  color: var(--color-muted);
  font-weight: 700;
  text-decoration: none;
}
.subject-detail__hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  padding: clamp(1.8rem, 5vw, 3.5rem);
  border-radius: 1.6rem;
  background: var(--color-ink);
  box-shadow: var(--shadow-card);
  color: #fffaf0;
}
.subject-detail__hero .eyebrow {
  color: #9ed2bd;
}
.subject-detail__professor {
  margin: 1.2rem 0 0;
  color: #c7d6cf;
}
.subject-detail__metric {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  min-width: 7rem;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.07);
}
.subject-detail__metric strong {
  font-family: var(--font-display);
  font-size: 2rem;
}
.subject-detail__metric span {
  color: #c7d6cf;
  font-size: 0.78rem;
}
.subject-detail__grades,
.subject-detail__loading,
.subject-detail__not-found {
  margin-top: 1.5rem;
  padding: clamp(1.4rem, 4vw, 2rem);
  border: 1px solid var(--color-border);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.subject-detail__grades h2 {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
}
.subject-detail__grades p {
  color: var(--color-muted);
}
.subject-detail__grades span {
  display: inline-block;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  font-size: 0.75rem;
  font-weight: 700;
}
.subject-detail__not-found {
  text-align: center;
}
.subject-detail__not-found > span {
  color: var(--color-highlight);
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 800;
}
.subject-detail__not-found .button {
  margin-top: 1rem;
}
@media (max-width: 600px) {
  .subject-detail__hero {
    display: grid;
    align-items: start;
  }
}
</style>
