<script setup lang="ts">
// Internal imports
import AssessmentCoverageChart from '@/components/graphs/AssessmentCoverageChart.vue';
import AverageBySemesterChart from '@/components/graphs/AverageBySemesterChart.vue';
import AverageBySubjectChart from '@/components/graphs/AverageBySubjectChart.vue';
import CreditsBySemesterChart from '@/components/graphs/CreditsBySemesterChart.vue';
import GradeTypeDistributionChart from '@/components/graphs/GradeTypeDistributionChart.vue';
import { useAuthStore } from '@/stores/AuthStore.js';
// External imports
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// Store state
const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const semesterCount = computed<number>((): number => currentUser.value?.semesters.length ?? 0);
const semesterCountLabel = computed<string>((): string =>
  semesterCount.value === 1
    ? '1 semestre registrado'
    : `${semesterCount.value} semestres registrados`,
);
</script>

<template>
  <section class="dashboard-page" aria-labelledby="dashboard-title">
    <header class="dashboard-page__header">
      <div>
        <p class="eyebrow">Tu espacio académico</p>
        <h1 id="dashboard-title" class="page-title">
          Hola, {{ currentUser?.name ?? 'estudiante' }}.
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

    <div class="dashboard-page__grid">
      <article class="dashboard-stat dashboard-stat--highlight">
        <span class="dashboard-stat__label">Recorrido académico</span>
        <strong>{{ semesterCount }}</strong>
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
        <AverageBySemesterChart />
        <AverageBySubjectChart />
      </div>
      <div class="dashboard-page__charts">
        <CreditsBySemesterChart />
        <GradeTypeDistributionChart />
        <AssessmentCoverageChart />
      </div>
    </section>
  </section>
</template>

<style scoped>
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
