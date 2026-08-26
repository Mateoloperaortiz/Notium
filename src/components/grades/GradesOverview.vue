<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import PageHeading from '@/components/layout/PageHeading.vue'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/date.util'
import { formatPercentage, formatScore, round } from '@/utils/format.util'
import { gradeTypeLabel } from '@/models'
import type { Grade } from '@/models'
import { RouteName } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useGradeStore } from '@/stores/grade.store'
import { useSemesterStore } from '@/stores/semester.store'
import { useSubjectStore } from '@/stores/subject.store'

const emit = defineEmits<{ create: []; edit: [grade: Grade] }>()
const auth = useAuthStore()
const semesterStore = useSemesterStore()
const subjectStore = useSubjectStore()
const gradeStore = useGradeStore()
const { confirm } = useConfirm()
const { success } = useToast()

const userSemesters = computed(() => {
  const userId = auth.currentUser?.id
  return userId === undefined ? [] : semesterStore.listByUser(userId)
})

const userSubjects = computed(() => {
  const semesterIds = userSemesters.value.map((semester) => semester.id)
  return subjectStore.listBySemesters(semesterIds)
})

const grades = computed(() => {
  const subjectIds = userSubjects.value.map((subject) => subject.id)
  return gradeStore.listBySubjects(subjectIds)
})

const totalCoveredPercentage = computed<number>(() =>
  grades.value.reduce((sum, grade) => sum + grade.percentage, 0),
)

const averageValue = computed<number>(() => {
  if (grades.value.length === 0) {
    return 0
  }

  const total = grades.value.reduce((sum, grade) => sum + grade.value, 0)
  return round(total / grades.value.length)
})

function subjectName(subjectId: string): string {
  return (
    userSubjects.value.find((subject) => subject.id === subjectId)?.name ?? 'Materia no encontrada'
  )
}

function semesterNameForSubject(subjectId: string): string {
  const semesterId = userSubjects.value.find((subject) => subject.id === subjectId)?.semesterId
  if (semesterId === undefined) {
    return 'Semestre no encontrado'
  }

  return (
    userSemesters.value.find((semester) => semester.id === semesterId)?.name ??
    'Semestre no encontrado'
  )
}

async function removeGrade(grade: Grade): Promise<void> {
  const confirmed = await confirm({
    title: 'Eliminar nota',
    message: `Se eliminara la nota "${grade.title}". Esta accion no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    destructive: true,
  })

  if (!confirmed) {
    return
  }

  if (gradeStore.removeGrade(grade.id)) {
    success('Nota eliminada correctamente.')
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHeading
      title="Tus notas"
      description="Consulta tus evaluaciones registradas y su impacto sobre cada materia."
      :back-to="{ name: RouteName.Dashboard }"
    >
      <template #actions>
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Nueva nota
        </BaseButton>
      </template>
    </PageHeading>

    <section class="grid gap-4 md:grid-cols-3">
      <BaseCard title="Total" description="Evaluaciones registradas" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-ink-900">{{ grades.length }}</p>
        </div>
      </BaseCard>

      <BaseCard title="Promedio" description="Promedio simple de notas" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-brand-700">
            {{ formatScore(averageValue) }}
          </p>
        </div>
      </BaseCard>

      <BaseCard title="Cobertura" description="Porcentaje evaluado acumulado" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-emerald-700">
            {{ formatPercentage(totalCoveredPercentage) }}
          </p>
        </div>
      </BaseCard>
    </section>

    <BaseCard title="Listado" description="Notas de tus materias">
      <EmptyState
        v-if="grades.length === 0"
        title="Aun no tienes notas"
        message="Cuando registres una evaluacion, aparecera aqui con su tipo, fecha, peso y materia asociada."
      >
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Crear primera nota
        </BaseButton>
      </EmptyState>

      <div v-else class="space-y-3">
        <article
          v-for="grade in grades"
          :key="grade.id"
          class="rounded-xl border border-ink-100 bg-white px-4 py-4 transition-colors hover:bg-ink-50/50"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                {{ gradeTypeLabel(grade.type) }}
              </p>
              <h3 class="mt-1 text-base font-semibold text-ink-900">{{ grade.title }}</h3>
              <p class="mt-1 text-sm text-ink-500">
                {{ subjectName(grade.subjectId) }} · {{ semesterNameForSubject(grade.subjectId) }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-sm font-semibold text-ink-800">{{ formatScore(grade.value) }}</p>
              <p class="mt-1 text-xs text-ink-500">{{ formatPercentage(grade.percentage) }}</p>
              <p class="mt-1 text-xs text-ink-500">{{ formatDate(grade.date) }}</p>
            </div>
          </div>
          <div class="mt-3 flex justify-end border-t border-ink-100 pt-3">
            <BaseButton
              variant="ghost"
              size="sm"
              aria-label="Editar nota"
              title="Editar nota"
              @click="emit('edit', grade)"
            >
              <AppIcon name="pencil" :size="16" />
              Editar
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              aria-label="Eliminar nota"
              title="Eliminar nota"
              @click="removeGrade(grade)"
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
