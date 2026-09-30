<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { SubjectService } from '@/services/SubjectService.js';
import { DateFormatUtil } from '@/utils/DateFormatUtil.js';

// External imports
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// Props
const props = defineProps<{ grade: GradeInterface }>();

// Computed
const subjectName = computed<string>(
  (): string => SubjectService.getSubjectById(props.grade.subjectId)?.name ?? '—',
);
</script>

<template>
  <article class="grade-card">
    <header class="grade-card__header">
      <div>
        <p class="grade-card__eyebrow">{{ grade.type }}</p>
        <h2 class="grade-card__title">{{ grade.title }}</h2>
      </div>
      <strong class="grade-card__value">{{ grade.value.toFixed(1) }}</strong>
    </header>

    <dl class="grade-card__details">
      <div>
        <dt>Materia</dt>
        <dd>{{ subjectName }}</dd>
      </div>
      <div>
        <dt>Porcentaje</dt>
        <dd>{{ grade.percentage }}%</dd>
      </div>
      <div>
        <dt>Fecha</dt>
        <dd>{{ DateFormatUtil.formatDate(grade.date) }}</dd>
      </div>
    </dl>

    <footer class="grade-card__actions">
      <RouterLink
        class="grade-card__detail-link"
        :to="{ name: 'grade-show', params: { subjectId: grade.subjectId, gradeId: grade.id } }"
      >
        Ver detalle
      </RouterLink>
    </footer>
  </article>
</template>

<style scoped>
.grade-card {
  display: grid;
  gap: 1.25rem;
  padding: 1.35rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.grade-card__header,
.grade-card__actions {
  display: flex;
  align-items: center;
}
.grade-card__header,
.grade-card__actions {
  justify-content: space-between;
  gap: 1rem;
}
.grade-card__eyebrow {
  margin: 0 0 0.25rem;
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}
.grade-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
}
.grade-card__value {
  color: var(--color-accent-dark);
  font-family: var(--font-display);
  font-size: 2rem;
}
.grade-card__details {
  display: grid;
  gap: 0.7rem;
  margin: 0;
}
.grade-card__details div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.grade-card__details dt {
  color: var(--color-muted);
}
.grade-card__details dd {
  margin: 0;
  font-weight: 700;
  text-align: right;
}
.grade-card__detail-link {
  color: var(--color-accent-dark);
  font-weight: 700;
  text-decoration: none;
}
@media (max-width: 34rem) {
  .grade-card__actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
