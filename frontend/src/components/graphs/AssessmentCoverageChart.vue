<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';

// External imports
import type { ChartData, ChartOptions } from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

// Props
const props = defineProps<{ grades: GradeInterface[]; subjects: SubjectInterface[] }>();

// Computed
const chartData = computed<ChartData<'bar'>>((): ChartData<'bar'> => ({
  datasets: [
    {
      backgroundColor: '#e7a547',
      borderRadius: 8,
      data: props.subjects.map((subject: SubjectInterface): number =>
        props.grades
          .filter((grade: GradeInterface): boolean => grade.subjectId === subject.id)
          .reduce((total: number, grade: GradeInterface): number => total + grade.percentage, 0),
      ),
      label: 'Porcentaje evaluado',
    },
  ],
  labels: props.subjects.map((subject: SubjectInterface): string => subject.code),
}));

const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 100 } },
};
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Seguimiento</p>
      <h2>Evaluaciones completadas</h2>
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
