<script setup lang="ts">
// Internal imports
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
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
import { onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const semesters = ref<SemesterInterface[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');

const chartData = ref<ChartData<'bar'>>({ labels: [], datasets: [] });
const chartOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

function getSemesterCredits(semester: SemesterInterface): number {
  return semester.subjects.reduce(
    (total: number, subject: { credits: number }): number => total + subject.credits,
    0,
  );
}

async function loadData(): Promise<void> {
  try {
    semesters.value = await SemesterService.findAllByCurrentUser();
    chartData.value = {
      labels: semesters.value.map((semester: SemesterInterface): string => semester.name),
      datasets: [
        {
          backgroundColor: '#9ed2bd',
          borderColor: '#236b56',
          borderWidth: 1,
          data: semesters.value.map(getSemesterCredits),
          label: 'Créditos',
        },
      ],
    };
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
      <p class="eyebrow">Carga académica</p>
      <h2>Créditos por semestre</h2>
    </header>
    <div v-if="isLoading" class="graph-state">Cargando gráfico...</div>
    <p v-else-if="errorMessage" class="graph-state graph-state--error">{{ errorMessage }}</p>
    <div v-else-if="semesters.length" class="graph-canvas">
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
.graph-state--error {
  color: var(--color-danger);
}
</style>
