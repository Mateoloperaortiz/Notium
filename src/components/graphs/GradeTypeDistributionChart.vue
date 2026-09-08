<script setup lang="ts">
// Internal imports
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { GradeService } from '@/services/GradeService.js';
// External imports
import {
  ArcElement,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { computed, onMounted, ref } from 'vue';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const grades = ref<GradeInterface[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');
const colors: string[] = ['#236b56', '#e7a547', '#9ed2bd', '#a53f3f', '#65766f'];

function getGradeTypeCounts(): Map<string, number> {
  const counts = new Map<string, number>();

  grades.value.forEach((grade: GradeInterface): void => {
    counts.set(grade.type, (counts.get(grade.type) ?? 0) + 1);
  });

  return counts;
}

const chartData = computed<ChartData<'doughnut'>>((): ChartData<'doughnut'> => {
  const counts = getGradeTypeCounts();
  const labels = [...counts.keys()];
  return {
    labels,
    datasets: [
      {
        backgroundColor: labels.map(
          (_: string, index: number): string => colors[index % colors.length] ?? '#236b56',
        ),
        data: labels.map((label: string): number => counts.get(label) ?? 0),
      },
    ],
  };
});

const chartOptions: ChartOptions<'doughnut'> = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};

async function loadData(): Promise<void> {
  try {
    grades.value = await GradeService.findAllByCurrentUser();
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
      <p class="eyebrow">Evaluaciones</p>
      <h2>Notas por tipo</h2>
    </header>
    <div v-if="isLoading" class="graph-state">Cargando gráfico...</div>
    <p v-else-if="errorMessage" class="graph-state graph-state--error">{{ errorMessage }}</p>
    <div v-else-if="grades.length" class="graph-canvas">
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
.graph-state--error {
  color: var(--color-danger);
}
</style>
