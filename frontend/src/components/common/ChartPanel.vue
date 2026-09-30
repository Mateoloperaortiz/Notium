<script setup lang="ts">
// External imports
import type { ChartData, ChartOptions } from 'chart.js';
import { computed } from 'vue';
import { Chart } from 'vue-chartjs';

// Props
const props = defineProps<{
  data: ChartData<'bar' | 'line'>;
  title: string;
  type: 'bar' | 'line';
}>();

// Computed
const options = computed<ChartOptions<'bar' | 'line'>>((): ChartOptions<'bar' | 'line'> => ({
  maintainAspectRatio: false,
  plugins: { legend: { display: props.data.datasets.length > 1 } },
  responsive: true,
  scales: { y: { beginAtZero: true } },
}));
</script>

<template>
  <figure class="chart-panel">
    <figcaption class="chart-panel__title">{{ title }}</figcaption>
    <div class="chart-panel__canvas-wrap">
      <Chart :type="type" :data="data" :options="options" role="img" :aria-label="title" />
    </div>
  </figure>
</template>

<style scoped>
.chart-panel {
  margin: 0;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 1.1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.chart-panel__title {
  margin: 0 0 0.9rem;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
}

.chart-panel__canvas-wrap {
  position: relative;
  height: 16rem;
}
</style>
