<script setup lang="ts">
// Internal imports
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { AuthService } from '@/services/AuthService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';

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
      backgroundColor: '#9ed2bd',
      borderColor: '#236b56',
      borderWidth: 1,
      data: semesters.map((semester: SemesterInterface): number =>
        SubjectService.getSubjectsBySemesterId(semester.id).reduce(
          (total: number, subject: SubjectInterface): number => total + subject.credits,
          0,
        ),
      ),
      label: 'Créditos',
    },
  ],
};
const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Carga académica</p>
      <h2>Créditos por semestre</h2>
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
