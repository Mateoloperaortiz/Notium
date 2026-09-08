<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { SubjectService } from '@/services/SubjectService.js';
// External imports
import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { computed, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const subjects = ref<SubjectInterface[]>([]);
const grades = ref<GradeInterface[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');

function getSubjectAverage(subject: SubjectInterface): number {
  const subjectGrades = grades.value.filter(
    (grade: GradeInterface): boolean => grade.subject.id === subject.id,
  );

  if (subjectGrades.length === 0) return 0;

  return (
    subjectGrades.reduce((total: number, grade: GradeInterface): number => total + grade.value, 0) /
    subjectGrades.length
  );
}

const chartData = computed<ChartData<'bar'>>((): ChartData<'bar'> => ({
  labels: subjects.value.map((subject: SubjectInterface): string => subject.code),
  datasets: [
    {
      backgroundColor: '#e7a547',
      borderRadius: 8,
      data: subjects.value.map(getSubjectAverage),
      label: 'Promedio',
    },
  ],
}));

const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 5 } },
};

async function loadData(): Promise<void> {
  try {
    [subjects.value, grades.value] = await Promise.all([
      SubjectService.findAllByCurrentUser(),
      GradeService.findAllByCurrentUser(),
    ]);
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No fue posible cargar el gráfico.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <article class="graph-panel">
    <header>
      <p class="eyebrow">Comparativa</p>
      <h2>Promedio por materia</h2>
    </header>
    <div v-if="isLoading" class="graph-state">Cargando gráfico...</div>
    <p v-else-if="errorMessage" class="graph-state graph-state--error">{{ errorMessage }}</p>
    <div v-else-if="subjects.length" class="graph-canvas">
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
.graph-state--error {
  color: var(--color-danger);
}
</style>
