<script setup lang="ts">
// Imports internos
import ChartPanel from '@/components/common/ChartPanel.vue';
import type {
  PlatformReportFilterDTO,
  SemesterStatusCountDTO,
  UserSummaryDTO,
} from '@/dtos/PlatformReportDTOs.js';
import { StatusSemester } from '@/interfaces/SemesterInterface.js';
import { Role } from '@/interfaces/UserInterface.js';
import { PlatformReportService } from '@/services/PlatformReportService.js';
import TableRenderUtil from '@/utils/TableRenderUtil.js';
// Imports externos
import type { ChartData } from 'chart.js';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTable from 'datatables.net-vue3';
import { computed, onMounted, ref, shallowRef, watch } from 'vue';

DataTable.use(DataTablesCore);

// Estado de la vista
const availableYears = shallowRef<number[]>([]);
const userSummaries = shallowRef<UserSummaryDTO[]>([]);
const statusCounts = shallowRef<Map<StatusSemester, number>>(new Map());
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(true);
const selectedYear = ref<string>('');
const selectedPeriod = ref<string>('');

// Estado derivado de la vista
const activeFilter = computed<PlatformReportFilterDTO>((): PlatformReportFilterDTO => ({
  period: selectedPeriod.value === '' ? undefined : Number(selectedPeriod.value),
  year: selectedYear.value === '' ? undefined : Number(selectedYear.value),
}));

const roleLabel = (role: Role): string => (role === Role.Admin ? 'Administrador' : 'Estudiante');

const userTableColumns = [
  {
    data: 'name',
    render: (name: string): string => TableRenderUtil.renderText(name),
    title: 'Usuario',
  },
  {
    data: 'email',
    render: (email: string): string => TableRenderUtil.renderText(email),
    title: 'Correo',
  },
  { data: 'role', render: (role: Role): string => roleLabel(role), title: 'Rol' },
  { data: 'semesterCount', title: 'Semestres' },
  { data: 'subjectCount', title: 'Materias' },
  {
    data: 'averageGrade',
    render: (averageGrade: number | null): string =>
      averageGrade === null ? '—' : averageGrade.toFixed(2),
    title: 'Nota promedio',
  },
];

const statusChartData = computed<ChartData<'bar' | 'line'>>((): ChartData<'bar' | 'line'> => ({
  datasets: [
    {
      backgroundColor: '#236b56',
      data: Object.values(StatusSemester).map(
        (status: StatusSemester): number => statusCounts.value.get(status) ?? 0,
      ),
      label: 'Semestres',
    },
  ],
  labels: Object.values(StatusSemester),
}));

const roleChartData = computed<ChartData<'bar' | 'line'>>((): ChartData<'bar' | 'line'> => {
  const adminCount = userSummaries.value.filter(
    (summary: UserSummaryDTO): boolean => summary.role === Role.Admin,
  ).length;
  const studentCount = userSummaries.value.length - adminCount;

  return {
    datasets: [{ backgroundColor: '#e7a547', data: [studentCount, adminCount], label: 'Usuarios' }],
    labels: ['Estudiantes', 'Administradores'],
  };
});

// Carga de datos
async function loadReport(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const [years, summaries, distribution] = await Promise.all([
      PlatformReportService.getAvailableYears(),
      PlatformReportService.getUserSummaries(activeFilter.value),
      PlatformReportService.getSemesterStatusDistribution(activeFilter.value),
    ]);

    availableYears.value = years;
    userSummaries.value = summaries;
    statusCounts.value = new Map(
      distribution.map((entry: SemesterStatusCountDTO): [StatusSemester, number] => [
        entry.status,
        entry.count,
      ]),
    );
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No fue posible cargar el reporte.';
  } finally {
    isLoading.value = false;
  }
}

watch(activeFilter, (): void => {
  void loadReport();
});
onMounted((): void => {
  void loadReport();
});
</script>

<template>
  <section class="admin-reports-page" aria-labelledby="admin-reports-title">
    <header>
      <p class="eyebrow">Administración</p>
      <h1 id="admin-reports-title" class="page-title">Reportes de la plataforma</h1>
      <p class="page-description">
        Filtra por año y periodo para ver cómo avanza la comunidad de Notium.
      </p>
    </header>

    <div class="admin-reports-page__filters">
      <label>
        Año
        <select v-model="selectedYear">
          <option value="">Todos</option>
          <option v-for="year in availableYears" :key="year" :value="String(year)">
            {{ year }}
          </option>
        </select>
      </label>

      <label>
        Periodo
        <select v-model="selectedPeriod">
          <option value="">Todos</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </label>
    </div>

    <p v-if="errorMessage" class="status-message status-message--error" role="alert">
      {{ errorMessage }}
    </p>

    <p v-if="isLoading" class="status-message">Cargando reporte…</p>

    <template v-else>
      <div class="admin-reports-page__charts">
        <ChartPanel title="Semestres por estado" type="bar" :data="statusChartData" />
        <ChartPanel title="Usuarios por rol" type="bar" :data="roleChartData" />
      </div>

      <div class="admin-reports-page__table-wrap">
        <DataTable
          class="display admin-reports-table"
          :data="userSummaries"
          :columns="userTableColumns"
          :options="{
            language: {
              emptyTable: 'No hay usuarios para los filtros seleccionados.',
              info: 'Mostrando _START_ a _END_ de _TOTAL_ usuarios',
              infoEmpty: 'No hay usuarios para mostrar',
              lengthMenu: 'Mostrar _MENU_ usuarios',
              search: 'Buscar:',
              zeroRecords: 'No se encontraron usuarios.',
            },
            order: [[0, 'asc']],
            pageLength: 10,
          }"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.admin-reports-page__filters {
  display: flex;
  gap: 1.25rem;
  margin: 1.75rem 0;
}

.admin-reports-page__filters label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--color-ink);
  font-size: 0.82rem;
  font-weight: 700;
}

.admin-reports-page__filters select {
  min-height: 2.6rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  background: var(--color-surface);
  font: inherit;
}

.admin-reports-page__charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.admin-reports-page__table-wrap {
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 720px) {
  .admin-reports-page__charts {
    grid-template-columns: 1fr;
  }
}
</style>
