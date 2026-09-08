<script setup lang="ts">
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  type ChartData,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { onBeforeUnmount, onMounted, ref, type Ref, shallowRef, type ShallowRef, watch } from 'vue';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

interface Props {
  data: ChartData<'bar' | 'line'>;
  title: string;
  type: 'bar' | 'line';
}

const props = defineProps<Props>();

const canvasElement: Ref<HTMLCanvasElement | null> = ref(null);
const chartInstance: ShallowRef<Chart<'bar' | 'line'> | null> = shallowRef(null);

const renderChart = (): void => {
  if (canvasElement.value === null) {
    return;
  }

  chartInstance.value?.destroy();
  chartInstance.value = new Chart<'bar' | 'line'>(canvasElement.value, {
    data: props.data,
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: props.data.datasets.length > 1 } },
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
    type: props.type,
  });
};

watch((): [ChartData<'bar' | 'line'>, string] => [props.data, props.type], renderChart, {
  deep: true,
});

onMounted(renderChart);

onBeforeUnmount((): void => {
  chartInstance.value?.destroy();
});
</script>

<template>
  <figure class="chart-panel">
    <figcaption class="chart-panel__title">{{ title }}</figcaption>
    <div class="chart-panel__canvas-wrap">
      <canvas ref="canvasElement" role="img" :aria-label="title"></canvas>
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
