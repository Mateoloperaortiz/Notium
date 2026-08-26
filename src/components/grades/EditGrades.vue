<script setup lang="ts">
import { computed, ref } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseField from '@/components/base/BaseField.vue'
import type { CreateGradeDTO, UpdateGradeDTO } from '@/dto/CreateGradeDTO'
import { GRADE_TYPE_OPTIONS, GradeType } from '@/models'
import type { Grade } from '@/models'
import { useAuthStore } from '@/stores/auth.store'
import { useGradeStore } from '@/stores/grade.store'
import { useSemesterStore } from '@/stores/semester.store'
import { useSubjectStore } from '@/stores/subject.store'
import { todayInputValue } from '@/utils/date.util'
import { useToast } from '@/composables/useToast'

const props = withDefaults(defineProps<{ grade?: Grade | null }>(), { grade: null })
const emit = defineEmits<{ cancel: []; created: []; updated: [] }>()

const auth = useAuthStore()
const semesterStore = useSemesterStore()
const subjectStore = useSubjectStore()
const gradeStore = useGradeStore()
const { success } = useToast()

const userSemesters = computed(() => {
  const userId = auth.currentUser?.id
  return userId === undefined ? [] : semesterStore.listByUser(userId)
})

const userSubjects = computed(() => {
  const semesterIds = userSemesters.value.map((semester) => semester.id)
  return subjectStore.listBySemesters(semesterIds)
})

const title = ref(props.grade?.title ?? '')
const value = ref(props.grade?.value ?? 0)
const percentage = ref(props.grade?.percentage ?? 10)
const type = ref<GradeType>(props.grade?.type ?? GradeType.Partial)
const date = ref(props.grade?.date ?? todayInputValue())
const subjectId = ref(props.grade?.subjectId ?? '')

const errorMessage = ref('')
const isSubmitting = ref(false)
const isEditing = props.grade !== null

const availablePercentage = computed<number>(() => {
  if (subjectId.value === '') {
    return 100
  }

  const used = gradeStore.usedPercentage(subjectId.value, props.grade?.id)
  return Math.max(0, 100 - used)
})

function cancel(): void {
  errorMessage.value = ''
  emit('cancel')
}

function submit(): void {
  isSubmitting.value = true
  errorMessage.value = ''

  const gradeData = {
    title: title.value,
    value: value.value,
    percentage: percentage.value,
    type: type.value,
    date: date.value,
    subjectId: subjectId.value,
  }

  const result =
    isEditing && props.grade !== null
      ? gradeStore.updateGrade(props.grade.id, gradeData satisfies UpdateGradeDTO)
      : gradeStore.createGrade(gradeData satisfies CreateGradeDTO)

  isSubmitting.value = false
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }

  success(isEditing ? 'Nota actualizada correctamente.' : 'Nota creada correctamente.')
  if (isEditing) {
    emit('updated')
  } else {
    emit('created')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <span
        class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
      >
        <AppIcon name="report" />
      </span>
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-ink-900">
          {{ isEditing ? 'Editar nota' : 'Nueva nota' }}
        </h1>
        <p class="mt-1 text-sm text-ink-500">
          {{
            isEditing
              ? 'Actualiza los datos de esta evaluacion.'
              : 'Registra una evaluacion asociada a una materia.'
          }}
        </p>
      </div>
    </div>

    <BaseCard
      title="Informacion de la evaluacion"
      description="Completa los datos principales de la nota."
    >
      <form class="space-y-5" @submit.prevent="submit">
        <BaseField label="Titulo" required>
          <template #default="{ fieldId }">
            <input
              :id="fieldId"
              v-model="title"
              type="text"
              required
              placeholder="Parcial 1"
              class="field-input"
            />
          </template>
        </BaseField>

        <div class="grid gap-5 sm:grid-cols-2">
          <BaseField label="Nota" required>
            <template #default="{ fieldId }">
              <input
                :id="fieldId"
                v-model.number="value"
                type="number"
                step="0.1"
                min="0"
                max="5"
                required
                class="field-input"
              />
            </template>
          </BaseField>

          <BaseField
            label="Porcentaje"
            :hint="`Disponible: ${availablePercentage.toFixed(0)} %`"
            required
          >
            <template #default="{ fieldId }">
              <input
                :id="fieldId"
                v-model.number="percentage"
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                required
                class="field-input"
              />
            </template>
          </BaseField>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <BaseField label="Tipo" required>
            <template #default="{ fieldId }">
              <select :id="fieldId" v-model="type" class="field-input" required>
                <option
                  v-for="option in GRADE_TYPE_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </template>
          </BaseField>

          <BaseField label="Fecha" required>
            <template #default="{ fieldId }">
              <input :id="fieldId" v-model="date" type="date" required class="field-input" />
            </template>
          </BaseField>
        </div>

        <BaseField label="Materia" required>
          <template #default="{ fieldId }">
            <select :id="fieldId" v-model="subjectId" class="field-input" required>
              <option value="" disabled>Selecciona una materia</option>
              <option v-for="subject in userSubjects" :key="subject.id" :value="subject.id">
                {{ subject.code }} - {{ subject.name }}
              </option>
            </select>
          </template>
        </BaseField>

        <p v-if="errorMessage !== ''" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {{ errorMessage }}
        </p>

        <div class="flex flex-wrap justify-end gap-2 border-t border-ink-100 pt-5">
          <BaseButton type="button" variant="secondary" :disabled="isSubmitting" @click="cancel">
            Cancelar
          </BaseButton>
          <BaseButton type="submit" :disabled="isSubmitting || userSubjects.length === 0">
            <AppIcon :name="isEditing ? 'pencil' : 'plus'" :size="16" />
            {{
              isSubmitting
                ? isEditing
                  ? 'Guardando...'
                  : 'Creando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear nota'
            }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
