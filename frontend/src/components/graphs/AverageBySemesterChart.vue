<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { AnalyticsUtil } from '@/utils/AnalyticsUtil.js';

// External imports
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'vue-chartjs';

// State
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const semesters = SemesterService.getSemestersByUserId(loggedUserId);
const chartData: ChartData<'bar'> = {
  labels: semesters.map((semester: SemesterInterface): string => semester.name),
  datasets: [
    {
      backgroundColor: '#236b56',
      borderRadius: 8,
      data: semesters.map(
        (semester: SemesterInterface): number =>
          AnalyticsUtil.getAverage(
            GradeService.getGradesBySubjects(
              SubjectService.getSubjectsBySemesterId(semester.id),
            ).map((grade: GradeInterface): number => grade.value),
          ) ?? 0,
      ),
      label: 'Promedio',
    },
  ],
};
const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 5 } },
};
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Rendimiento</p>
      <h2>Promedio por semestre</h2>
    </header>
    <div v-if="semesters.length" class="graph-canvas">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="graph-state">Aún no hay semestres registrados.</p>
  </article>
</template>

<style scoped>
.graph-panel {
  min-width: 0;
  padding: 1.4rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}
.graph-panel header h2 {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
  font-size: 1.2rem;
}
.graph-canvas {
  position: relative;
  height: 16rem;
  margin-top: 1.2rem;
}
.graph-state {
  display: grid;
  min-height: 16rem;
  margin: 0;
  place-items: center;
  color: var(--color-muted);
  text-align: center;
}
</style>
