<script setup lang="ts">
// Internal imports
import AssessmentCoverageChart from '@/components/graphs/AssessmentCoverageChart.vue';
import AverageBySemesterChart from '@/components/graphs/AverageBySemesterChart.vue';
import AverageBySubjectChart from '@/components/graphs/AverageBySubjectChart.vue';
import CreditsBySemesterChart from '@/components/graphs/CreditsBySemesterChart.vue';
import GradeTypeDistributionChart from '@/components/graphs/GradeTypeDistributionChart.vue';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { ErrorUtil } from '@/utils/ErrorUtil.js';

// External imports
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

// State
const loggedUser = AuthService.getLoggedUser();
const semesters = ref<SemesterInterface[]>([]);
const subjects = ref<SubjectInterface[]>([]);
const grades = ref<GradeInterface[]>([]);
const errorMessage = ref<string>('');

// Computed
const semesterCountLabel = computed<string>((): string =>
  semesters.value.length === 1
    ? '1 semestre registrado'
    : `${semesters.value.length} semestres registrados`,
);

// Functions
async function loadData(): Promise<void> {
  try {
    [semesters.value, subjects.value, grades.value] = await Promise.all([
      SemesterService.getSemesters(),
      SubjectService.getSubjects(),
      GradeService.getGrades(),
    ]);
  } catch (error: unknown) {
    errorMessage.value = ErrorUtil.getErrorMessage(error);
  }
}

// Lifecycle
onMounted(loadData);
</script>

<template>
  <section class="dashboard-page" aria-labelledby="dashboard-title">
    <header class="dashboard-page__header">
      <div>
        <p class="eyebrow">Tu espacio académico</p>
        <h1 id="dashboard-title" class="page-title">
          Hola, {{ loggedUser?.name ?? 'estudiante' }}.
        </h1>
        <p class="page-description">
          Este es tu resumen personal. Desde aquí puedes continuar organizando tu recorrido
          universitario.
        </p>
      </div>

      <RouterLink class="button button--primary" :to="{ name: 'semester-index' }">
        Ver mis semestres
        <span aria-hidden="true">→</span>
      </RouterLink>
    </header>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <div class="dashboard-page__grid">
      <article class="dashboard-stat dashboard-stat--highlight">
        <span class="dashboard-stat__label">Recorrido académico</span>
        <strong>{{ semesters.length }}</strong>
        <p>{{ semesterCountLabel }}</p>
      </article>

      <article class="dashboard-stat">
        <span class="dashboard-stat__label">Próximo paso</span>
        <strong>Organiza</strong>
        <p>Registra tus periodos y mantén tu avance en un solo lugar.</p>
      </article>
    </div>

    <section class="dashboard-page__graphs" aria-labelledby="dashboard-graphs-title">
      <div class="dashboard-page__section-heading">
        <div>
          <p class="eyebrow">Lectura rápida</p>
          <h2 id="dashboard-graphs-title">Tu recorrido en datos</h2>
        </div>
      </div>

      <div class="dashboard-page__charts dashboard-page__charts--wide">
        <AverageBySemesterChart :semesters="semesters" :subjects="subjects" :grades="grades" />
        <AverageBySubjectChart :subjects="subjects" :grades="grades" />
      </div>
      <div class="dashboard-page__charts">
        <CreditsBySemesterChart :semesters="semesters" :subjects="subjects" />
        <GradeTypeDistributionChart :grades="grades" />
        <AssessmentCoverageChart :subjects="subjects" :grades="grades" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.dashboard-page > .status-message {
  margin-top: 1.5rem;
}

.dashboard-page__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
}

.dashboard-page__header .button {
  flex: 0 0 auto;
  gap: 1.4rem;
}

.dashboard-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.15rem;
  margin-top: 3rem;
}

.dashboard-page__graphs {
  margin-top: 3rem;
}

.dashboard-page__section-heading h2 {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
  font-size: 1.55rem;
}

.dashboard-page__charts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.15rem;
  margin-top: 1.15rem;
}

.dashboard-page__charts--wide {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-stat {
  min-height: 12rem;
  padding: 1.5rem;
  border: 1px solid rgba(25, 51, 44, 0.09);
  border-radius: 1.25rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.dashboard-stat--highlight {
  background: var(--color-ink);
  color: var(--color-white);
}

.dashboard-stat__label {
  display: block;
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.dashboard-stat--highlight .dashboard-stat__label {
  color: #b8d9c8;
}

.dashboard-stat strong {
  display: block;
  margin-top: 1.6rem;
  font-family: var(--font-display);
  font-size: 2.4rem;
  line-height: 1;
}

.dashboard-stat p {
  margin: 0.65rem 0 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.dashboard-stat--highlight p {
  color: #d4e3dc;
}

@media (max-width: 700px) {
  .dashboard-page__header {
    display: grid;
    align-items: start;
  }

  .dashboard-page__grid {
    grid-template-columns: 1fr;
  }

  .dashboard-page__charts,
  .dashboard-page__charts--wide {
    grid-template-columns: 1fr;
  }
}
</style>
