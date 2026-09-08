<script setup lang="ts">
// Imports internos
import ChartPanel from '@/components/common/ChartPanel.vue';
import type {
  AnalyticsFilterDTO,
  EvolutionPointDTO,
  SemesterComparisonRowDTO,
  SemesterOptionDTO,
  TypeAverageDTO,
} from '@/dtos/AnalyticsDTOs.js';
import { AnalyticsService } from '@/services/AnalyticsService.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import TableRenderUtil from '@/utils/TableRenderUtil.js';
// Imports externos
import type { ChartData } from 'chart.js';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTable from 'datatables.net-vue3';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

DataTable.use(DataTablesCore);

// Estado del store
const { currentUser } = storeToRefs(useAuthStore());

// Estado de la vista
const selectedSemesterId = ref<string>('');
const selectedType = ref<string>('');

// Estado derivado de la vista
const semesterOptions = computed<SemesterOptionDTO[]>((): SemesterOptionDTO[] =>
  currentUser.value ? AnalyticsService.getSemesterOptions(currentUser.value) : [],
);

const gradeTypes = computed<string[]>((): string[] =>
  currentUser.value ? AnalyticsService.getGradeTypes(currentUser.value) : [],
);

const activeFilter = computed<AnalyticsFilterDTO>((): AnalyticsFilterDTO => ({
  semesterId: selectedSemesterId.value === '' ? undefined : selectedSemesterId.value,
  type: selectedType.value === '' ? undefined : selectedType.value,
}));

const evolutionChartData = computed<ChartData<'bar' | 'line'>>((): ChartData<'bar' | 'line'> => {
  const points = currentUser.value
    ? AnalyticsService.getEvolutionSeries(currentUser.value, activeFilter.value)
    : [];

  return {
    datasets: [
      {
        backgroundColor: 'rgba(35, 107, 86, 0.15)',
        borderColor: '#236b56',
        data: points.map((point: EvolutionPointDTO): number => point.value),
        fill: true,
        label: 'Nota',
        tension: 0.3,
      },
    ],
    labels: points.map((point: EvolutionPointDTO): string => point.label),
  };
});

const typeChartData = computed<ChartData<'bar' | 'line'>>((): ChartData<'bar' | 'line'> => {
  const averages = currentUser.value
    ? AnalyticsService.getTypeAverages(currentUser.value, activeFilter.value)
    : [];

  return {
    datasets: [
      {
        backgroundColor: '#e7a547',
        data: averages.map((entry: TypeAverageDTO): number => Number(entry.average.toFixed(2))),
        label: 'Promedio',
      },
    ],
    labels: averages.map((entry: TypeAverageDTO): string => entry.type),
  };
});

const comparisonRows = computed<SemesterComparisonRowDTO[]>((): SemesterComparisonRowDTO[] =>
  currentUser.value
    ? AnalyticsService.getSemesterComparison(currentUser.value, activeFilter.value)
    : [],
);

const comparisonColumns = [
  {
    data: 'semesterLabel',
    render: (label: string): string => TableRenderUtil.renderText(label),
    title: 'Semestre',
  },
  { data: 'subjectCount', title: 'Materias' },
  { data: 'gradeCount', title: 'Evaluaciones' },
  {
    data: 'averageGrade',
    render: (averageGrade: number | null): string =>
      averageGrade === null ? '—' : averageGrade.toFixed(2),
    title: 'Nota promedio',
  },
];
</script>

<template>
  <section class="analytics-page" aria-labelledby="analytics-title">
    <header>
      <p class="eyebrow">Tu progreso</p>
      <h1 id="analytics-title" class="page-title">Analíticas académicas</h1>
      <p class="page-description">
        Compara tu desempeño entre semestres y entre tipos de evaluación.
      </p>
    </header>

    <div class="analytics-page__filters">
      <label>
        Semestre
        <select v-model="selectedSemesterId">
          <option value="">Todos</option>
          <option v-for="option in semesterOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label>
        Tipo de evaluación
        <select v-model="selectedType">
          <option value="">Todos</option>
          <option v-for="type in gradeTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
    </div>

    <div class="analytics-page__charts">
      <ChartPanel title="Evolución de notas" type="line" :data="evolutionChartData" />
      <ChartPanel title="Promedio por tipo de evaluación" type="bar" :data="typeChartData" />
    </div>

    <div class="analytics-page__table-wrap">
      <DataTable
        class="display analytics-table"
        :data="comparisonRows"
        :columns="comparisonColumns"
        :options="{
          language: {
            emptyTable: 'No hay datos para los filtros seleccionados.',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ semestres',
            infoEmpty: 'No hay semestres para mostrar',
            lengthMenu: 'Mostrar _MENU_ semestres',
            search: 'Buscar:',
            zeroRecords: 'No se encontraron semestres.',
          },
          order: [[0, 'asc']],
          paging: false,
        }"
      />
    </div>
  </section>
</template>

<style scoped>
.analytics-page__filters {
  display: flex;
  gap: 1.25rem;
  margin: 1.75rem 0;
}

.analytics-page__filters label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--color-ink);
  font-size: 0.82rem;
  font-weight: 700;
}

.analytics-page__filters select {
  min-height: 2.6rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-surface);
  font: inherit;
}

.analytics-page__charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.analytics-page__table-wrap {
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 720px) {
  .analytics-page__charts {
    grid-template-columns: 1fr;
  }
}
</style>
