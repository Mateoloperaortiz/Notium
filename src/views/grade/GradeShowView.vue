<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { GradeService } from '@/services/GradeService.js';
// External imports
import { ref, shallowRef, watch } from 'vue';
import { RouterLink } from 'vue-router';

// Interfaces and types
interface Props {
  gradeId: string;
  subjectId: string;
}

// Props
const props = defineProps<Props>();

// View state
const grade = shallowRef<GradeInterface>();
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(true);

// Data loading
async function loadGrade(gradeId: string): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    grade.value = await GradeService.findById(gradeId);
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'No fue posible cargar la nota.';
    grade.value = undefined;
  } finally {
    isLoading.value = false;
  }
}

watch(
  (): string => props.gradeId,
  (gradeId: string): void => {
    void loadGrade(gradeId);
  },
  { immediate: true },
);
</script>

<template>
  <section class="grade-detail" aria-labelledby="grade-detail-title">
    <RouterLink class="grade-detail__back" :to="{ name: 'grade-index' }">
      <span aria-hidden="true">←</span>
      Volver a notas
    </RouterLink>

    <div v-if="isLoading" class="grade-detail__loading" aria-busy="true">Cargando nota...</div>
    <p v-else-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <div v-else-if="grade">
      <header class="grade-detail__hero">
        <div>
          <p class="eyebrow">{{ grade.type }}</p>
          <h1 id="grade-detail-title" class="page-title">{{ grade.title }}</h1>
          <p>Materia: {{ grade.subject.name }}</p>
        </div>
        <strong class="grade-detail__value">{{ grade.value.toFixed(1) }}</strong>
      </header>

      <dl class="grade-detail__data">
        <div>
          <dt>Porcentaje</dt>
          <dd>{{ grade.percentage }}%</dd>
        </div>
        <div>
          <dt>Fecha</dt>
          <dd>{{ new Date(grade.date).toLocaleDateString('es-CO') }}</dd>
        </div>
      </dl>
    </div>

    <div v-else class="grade-detail__not-found">
      <span aria-hidden="true">404</span>
      <h1 id="grade-detail-title">No encontramos esta nota</h1>
      <p>Puede que haya sido eliminada o que el enlace no sea correcto.</p>
      <RouterLink class="button button--primary" :to="{ name: 'grade-index' }"
        >Volver a notas</RouterLink
      >
    </div>
  </section>
</template>

<style scoped>
.grade-detail__back {
  display: inline-flex;
  gap: 0.55rem;
  margin-bottom: 2.5rem;
  color: var(--color-muted);
  font-weight: 700;
  text-decoration: none;
}
.grade-detail__hero {
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
.grade-detail__hero .eyebrow {
  color: #9ed2bd;
}
.grade-detail__hero p {
  color: #c7d6cf;
}
.grade-detail__value {
  color: #fffaf0;
  font-family: var(--font-display);
  font-size: 3rem;
}
.grade-detail__data,
.grade-detail__loading,
.grade-detail__not-found {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: clamp(1.4rem, 4vw, 2rem);
  border: 1px solid var(--color-border);
  border-radius: 1.3rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.grade-detail__data div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.grade-detail__data dd {
  margin: 0;
  font-weight: 700;
}
.grade-detail__not-found {
  text-align: center;
}
.grade-detail__not-found > span {
  color: var(--color-highlight);
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 800;
}
.grade-detail__not-found .button {
  margin-top: 1rem;
}
@media (max-width: 600px) {
  .grade-detail__hero {
    align-items: start;
    flex-direction: column;
  }
}
</style>
