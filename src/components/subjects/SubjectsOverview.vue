<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import PageHeading from '@/components/layout/PageHeading.vue'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { RouteName } from '@/router'
import type { Subject } from '@/models'
import { useAuthStore } from '@/stores/auth.store'
import { useSemesterStore } from '@/stores/semester.store'
import { useSubjectStore } from '@/stores/subject.store'

const emit = defineEmits<{ create: []; edit: [subject: Subject] }>()

const auth = useAuthStore()
const semesterStore = useSemesterStore()
const subjectStore = useSubjectStore()
const { confirm } = useConfirm()
const { success } = useToast()

const userSemesters = computed(() => {
  const userId = auth.currentUser?.id
  return userId === undefined ? [] : semesterStore.listByUser(userId)
})

const subjects = computed(() => {
  const semesterIds = userSemesters.value.map((semester) => semester.id)
  return subjectStore.listBySemesters(semesterIds)
})

const totalCredits = computed<number>(() =>
  subjects.value.reduce((total, subject) => total + subject.credits, 0),
)

function semesterName(semesterId: string): string {
  return (
    userSemesters.value.find((semester) => semester.id === semesterId)?.name ??
    'Semestre no encontrado'
  )
}

async function removeSubject(subject: Subject): Promise<void> {
  const confirmed = await confirm({
    title: 'Eliminar materia',
    message: `Se eliminara "${subject.name}" junto con sus notas. Esta accion no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    destructive: true,
  })

  if (!confirmed) {
    return
  }

  if (subjectStore.removeSubject(subject.id)) {
    success('Materia eliminada correctamente.')
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHeading
      title="Tus materias"
      description="Consulta las materias asociadas a tus semestres y sus datos principales."
      :back-to="{ name: RouteName.Dashboard }"
    >
      <template #actions>
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Nueva materia
        </BaseButton>
      </template>
    </PageHeading>

    <section class="grid gap-4 md:grid-cols-3">
      <BaseCard title="Total" description="Materias registradas" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-ink-900">{{ subjects.length }}</p>
        </div>
      </BaseCard>

      <BaseCard title="Creditos" description="Carga academica registrada" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-brand-700">{{ totalCredits }}</p>
        </div>
      </BaseCard>

      <BaseCard title="Semestres" description="Periodos con materias" :padded="false">
        <div class="px-5 py-4">
          <p class="text-3xl font-semibold tracking-tight text-emerald-700">
            {{ new Set(subjects.map((subject) => subject.semesterId)).size }}
          </p>
        </div>
      </BaseCard>
    </section>

    <BaseCard title="Listado" description="Materias de tus semestres">
      <EmptyState
        v-if="subjects.length === 0"
        title="Aun no tienes materias"
        message="Cuando agregues una materia, aparecera aqui junto con su semestre, profesor y creditos."
      >
        <BaseButton variant="secondary" size="sm" @click="emit('create')">
          <AppIcon name="plus" :size="16" />
          Crear primera materia
        </BaseButton>
      </EmptyState>

      <div v-else class="space-y-3">
        <article
          v-for="subject in subjects"
          :key="subject.id"
          class="rounded-xl border border-ink-100 bg-white px-4 py-4 transition-colors hover:bg-ink-50/50"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                {{ subject.code }}
              </p>
              <h3 class="mt-1 text-base font-semibold text-ink-900">{{ subject.name }}</h3>
              <p class="mt-1 text-sm text-ink-500">{{ subject.professor }}</p>
            </div>

            <div class="text-right">
              <p class="text-sm font-semibold text-ink-800">{{ subject.credits }} creditos</p>
              <p class="mt-1 text-xs text-ink-500">{{ semesterName(subject.semesterId) }}</p>
            </div>
          </div>

          <div class="mt-3 flex justify-end border-t border-ink-100 pt-3">
            <BaseButton
              variant="ghost"
              size="sm"
              aria-label="Editar materia"
              title="Editar materia"
              @click="emit('edit', subject)"
            >
              <AppIcon name="pencil" :size="16" />
              Editar
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              aria-label="Eliminar materia"
              title="Eliminar materia"
              @click="removeSubject(subject)"
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
