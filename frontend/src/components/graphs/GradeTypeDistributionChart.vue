<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { AnalyticsUtil } from '@/utils/AnalyticsUtil.js';

// External imports
import type { ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

// State
const colors: string[] = ['#236b56', '#e7a547', '#9ed2bd', '#a53f3f', '#65766f'];
const loggedUserId = AuthService.getLoggedUser()?.id ?? 0;
const semesters = SemesterService.getSemestersByUserId(loggedUserId);
const subjects = SubjectService.getSubjectsBySemesters(semesters);
const grades = GradeService.getGradesBySubjects(subjects);
const gradeTypes = AnalyticsUtil.getGradeTypes(grades);
const chartData: ChartData<'doughnut'> = {
  labels: gradeTypes,
  datasets: [
    {
      backgroundColor: gradeTypes.map(
        (_type: string, index: number): string => colors[index % colors.length] ?? '#236b56',
      ),
      data: gradeTypes.map(
        (type: string): number =>
          grades.filter((grade: GradeInterface): boolean => grade.type === type).length,
      ),
    },
  ],
};
const chartOptions: ChartOptions<'doughnut'> = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Evaluaciones</p>
      <h2>Notas por tipo</h2>
    </header>
    <div v-if="grades.length" class="graph-canvas">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="graph-state">Aún no hay notas registradas.</p>
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
