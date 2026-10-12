<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { AnalyticsUtil } from '@/utils/AnalyticsUtil.js';

// External imports
import type { ChartData, ChartOptions } from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

// Props
const props = defineProps<{ grades: GradeInterface[]; subjects: SubjectInterface[] }>();

// State
const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 5 } },
};

// Computed
const chartData = computed<ChartData<'bar'>>((): ChartData<'bar'> => ({
  datasets: [
    {
      backgroundColor: '#e7a547',
      borderRadius: 8,
      data: AnalyticsUtil.getAverageBySubject(props.subjects, props.grades),
      label: 'Promedio',
    },
  ],
  labels: props.subjects.map((subject: SubjectInterface): string => subject.code),
}));
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Comparativa</p>
      <h2>Promedio por materia</h2>
    </header>
    <div v-if="subjects.length" class="graph-canvas">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="graph-state">Aún no hay materias registradas.</p>
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
