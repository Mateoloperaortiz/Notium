<script setup lang="ts">
// Internal imports
import ChartPanel from '@/components/common/ChartPanel.vue';
import type {
  PlatformReportFilterDTO,
  SemesterStatusCountDTO,
  UserSummaryDTO,
} from '@/dtos/PlatformReportDTOs.js';
import { Role } from '@/interfaces/UserInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { UserService } from '@/services/UserService.js';
import { PlatformReportUtil } from '@/utils/PlatformReportUtil.js';
import { TableRenderUtil } from '@/utils/TableRenderUtil.js';

// External imports
import type { ChartData } from 'chart.js';
import DataTable from 'datatables.net-vue3';
import { computed, ref } from 'vue';

// State
const users = UserService.getUsers();
const semesters = SemesterService.getSemesters();
const subjects = SubjectService.getSubjects();
const grades = GradeService.getGrades();
const availableYears = PlatformReportUtil.getAvailableYears(semesters);
const selectedYear = ref<number>(0);
const selectedPeriod = ref<number>(0);
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
  {
    data: 'role',
    render: (role: Role): string => (role === Role.Admin ? 'Administrador' : 'Estudiante'),
    title: 'Rol',
  },
  { data: 'semesterCount', title: 'Semestres' },
  { data: 'subjectCount', title: 'Materias' },
  {
    data: 'averageGrade',
    render: (averageGrade: number | null): string =>
      averageGrade === null ? '—' : averageGrade.toFixed(2),
    title: 'Nota promedio',
  },
];

// Computed
const activeFilter = computed<PlatformReportFilterDTO>((): PlatformReportFilterDTO => ({
  period: selectedPeriod.value === 0 ? undefined : selectedPeriod.value,
  year: selectedYear.value === 0 ? undefined : selectedYear.value,
}));

const userSummaries = computed<UserSummaryDTO[]>((): UserSummaryDTO[] =>
  PlatformReportUtil.getUserSummaries(users, semesters, subjects, grades, activeFilter.value),
);

const statusChartData = computed<ChartData<'bar' | 'line'>>((): ChartData<'bar' | 'line'> => {
  const distribution = PlatformReportUtil.getSemesterStatusDistribution(
    semesters,
    activeFilter.value,
  );

  return {
    datasets: [
      {
        backgroundColor: '#236b56',
        data: distribution.map((entry: SemesterStatusCountDTO): number => entry.count),
        label: 'Semestres',
      },
    ],
    labels: distribution.map((entry: SemesterStatusCountDTO): string => entry.status),
  };
});

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
          <option :value="0">Todos</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </label>

      <label>
        Periodo
        <select v-model="selectedPeriod">
          <option :value="0">Todos</option>
          <option :value="1">1</option>
          <option :value="2">2</option>
        </select>
      </label>
    </div>

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
