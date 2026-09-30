<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { DateFormatUtil } from '@/utils/DateFormatUtil.js';

// External imports
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// Props
const props = defineProps<{ gradeId: string; subjectId: string }>();

// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;

// Computed
const subject = computed<SubjectInterface | undefined>((): SubjectInterface | undefined =>
  SubjectService.getSubjectsBySemesters(SemesterService.getSemestersByUserId(loggedUserId)).find(
    (userSubject: SubjectInterface): boolean => userSubject.id === Number(props.subjectId),
  ),
);

const grade = computed<GradeInterface | undefined>((): GradeInterface | undefined =>
  subject.value
    ? GradeService.getGradesBySubjectId(subject.value.id).find(
        (subjectGrade: GradeInterface): boolean => subjectGrade.id === Number(props.gradeId),
      )
    : undefined,
);
</script>

<template>
  <section class="grade-detail" aria-labelledby="grade-detail-title">
    <RouterLink class="grade-detail__back" :to="{ name: 'grade-index' }">
      <span aria-hidden="true">←</span>
      Volver a notas
    </RouterLink>

    <div v-if="grade">
      <header class="grade-detail__hero">
        <div>
          <p class="eyebrow">{{ grade.type }}</p>
          <h1 id="grade-detail-title" class="page-title">{{ grade.title }}</h1>
          <p>Materia: {{ subject?.name }}</p>
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
          <dd>{{ DateFormatUtil.formatDate(grade.date) }}</dd>
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
