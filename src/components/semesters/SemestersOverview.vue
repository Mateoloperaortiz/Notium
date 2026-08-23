<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import PageHeading from '@/components/layout/PageHeading.vue'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { semesterStatusLabel, semesterStatusTone } from '@/models'
import type { Semester } from '@/models'
import { RouteName } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useSemesterStore } from '@/stores/semester.store'

const emit = defineEmits<{ create: []; edit: [semester: Semester] }>()

const auth = useAuthStore()
const semesterStore = useSemesterStore()
const { confirm } = useConfirm()
const { success } = useToast()

const semesters = computed(() => {
  const userId = auth.currentUser?.id
  return userId === undefined ? [] : semesterStore.listByUser(userId)
})

const inProgressCount = computed<number>(() =>
  auth.currentUser?.id === undefined ? 0 : semesterStore.countInProgressByUser(auth.currentUser.id),
)

const completedCount = computed<number>(() =>
  auth.currentUser?.id === undefined ? 0 : semesterStore.countCompletedByUser(auth.currentUser.id),
)

function periodLabel(period: number): string {
  return `Periodo ${period}`
}

async function removeSemester(semester: Semester): Promise<void> {
  const confirmed = await confirm({
    title: 'Eliminar semestre',
    message: `Se eliminara "${semester.name}" junto con sus materias y notas. Esta accion no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    destructive: true,
  })

  if (!confirmed) {
    return
  }

  if (semesterStore.removeSemester(semester.id)) {
    success('Semestre eliminado correctamente.')
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHeading
      title="Tus semestres"
      description="Lista inicial de tus periodos academicos. Aqui veras rapidamente el estado de cada semestre y cuantas materias tiene."
      :back-to="{ name: RouteName.Dashboard }"
    >
      <template #actions>
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Nuevo semestre
        </BaseButton>
      </template>
    </PageHeading>

    <section class="grid gap-4 md:grid-cols-3">
      <BaseCard title="Total" description="Semestres registrados" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-ink-900">{{ semesters.length }}</p>
        </div>
      </BaseCard>

      <BaseCard title="En curso" description="Semestres activos" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-brand-700">{{ inProgressCount }}</p>
        </div>
      </BaseCard>

      <BaseCard title="Finalizados" description="Semestres cerrados" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-emerald-700">{{ completedCount }}</p>
        </div>
      </BaseCard>
    </section>

    <BaseCard title="Listado" description="Ordenados del mas reciente al mas antiguo">
      <EmptyState
        v-if="semesters.length === 0"
        title="Aun no tienes semestres"
        message="Cuando agregues el primero, aparecera aqui con su estado y cantidad de materias."
      >
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Crear primer semestre
        </BaseButton>
      </EmptyState>

      <div v-else class="space-y-3">
        <article
          v-for="semester in semesters"
          :key="semester.id"
          class="rounded-xl border border-ink-100 bg-white px-4 py-4 transition-colors hover:bg-ink-50/50"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-ink-900">{{ semester.name }}</h3>
              <p class="mt-1 text-sm text-ink-500">
                {{ semester.year }} - {{ periodLabel(semester.period) }}
              </p>
            </div>

            <BaseBadge :tone="semesterStatusTone(semester.status)">
              {{ semesterStatusLabel(semester.status) }}
            </BaseBadge>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-600">
            <span class="inline-flex items-center gap-1.5">
              <AppIcon name="book" :size="16" />
              {{ semesterStore.countSubjectsBySemester(semester.id) }} materias
            </span>
            <span class="inline-flex items-center gap-1.5">
              <AppIcon name="calendar" :size="16" />
              ID: {{ semester.id }}
            </span>
            <BaseButton
              variant="ghost"
              size="sm"
              aria-label="Editar semestre"
              title="Editar semestre"
              @click="emit('edit', semester)"
            >
              <AppIcon name="pencil" :size="16" />
              Editar
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              aria-label="Eliminar semestre"
              title="Eliminar semestre"
              @click="removeSemester(semester)"
            >
              <AppIcon name="trash" :size="16" />
              Eliminar
            </BaseButton>
          </div>
        </article>
      </div>
    </BaseCard>
  </div>
</template>
