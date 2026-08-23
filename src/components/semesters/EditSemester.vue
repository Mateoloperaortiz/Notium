<script setup lang="ts">
import { ref } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseField from '@/components/base/BaseField.vue'
import { SEMESTER_PERIOD_OPTIONS, SEMESTER_STATUS_OPTIONS, SemesterStatus } from '@/models'
import type { Semester } from '@/models'
import { useAuthStore } from '@/stores/auth.store'
import { useSemesterStore } from '@/stores/semester.store'
import { useToast } from '@/composables/useToast'
import type { CreateSemesterDTO, UpdateSemesterDTO } from '@/dto/CreateSemesterDTO'

const props = withDefaults(defineProps<{ semester?: Semester | null }>(), { semester: null })
const emit = defineEmits<{ cancel: []; created: []; updated: [] }>()

const auth = useAuthStore()
const semesterStore = useSemesterStore()
const { success } = useToast()

const name = ref(props.semester?.name ?? '')
const year = ref(props.semester?.year ?? new Date().getFullYear())
const period = ref(props.semester?.period ?? 1)
const status = ref<SemesterStatus>(props.semester?.status ?? SemesterStatus.Planned)
const errorMessage = ref('')
const isSubmitting = ref(false)
const isEditing = props.semester !== null

function cancel(): void {
  errorMessage.value = ''
  emit('cancel')
}

function submit(): void {
  const userId = auth.currentUser?.id
  if (userId === undefined) {
    errorMessage.value = 'No hay una sesion activa.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  const semesterData: UpdateSemesterDTO = {
    name: name.value,
    year: year.value,
    period: period.value,
    status: status.value,
  }

  const result =
    isEditing && props.semester !== null
      ? semesterStore.updateSemester(props.semester.id, semesterData)
      : semesterStore.createSemester({ ...semesterData, userId } as CreateSemesterDTO)

  isSubmitting.value = false
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }

  success(isEditing ? 'Semestre actualizado correctamente.' : 'Semestre creado correctamente.')
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
        <AppIcon name="calendar" />
      </span>
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-ink-900">
          {{ isEditing ? 'Editar semestre' : 'Nuevo semestre' }}
        </h1>
        <p class="mt-1 text-sm text-ink-500">
          {{
            isEditing
              ? 'Actualiza los datos de este periodo academico.'
              : 'Registra un periodo academico para organizar tus materias.'
          }}
        </p>
      </div>
    </div>

    <BaseCard
      title="Informacion del semestre"
      description="Completa los datos principales del periodo."
    >
      <form class="space-y-5" @submit.prevent="submit">
        <BaseField label="Nombre" hint="Por ejemplo: Semestre 7" required>
          <template #default="{ fieldId }">
            <input
              :id="fieldId"
              v-model="name"
              type="text"
              required
              placeholder="Semestre 7"
              class="field-input"
            />
          </template>
        </BaseField>

        <div class="grid gap-5 sm:grid-cols-2">
          <BaseField label="Ano" required>
            <template #default="{ fieldId }">
              <input
                :id="fieldId"
                v-model.number="year"
                type="number"
                min="1900"
                max="3000"
                required
                class="field-input"
              />
            </template>
          </BaseField>

          <BaseField label="Periodo" required>
            <template #default="{ fieldId }">
              <select :id="fieldId" v-model.number="period" class="field-input" required>
                <option
                  v-for="option in SEMESTER_PERIOD_OPTIONS"
                  :key="option.value"
                  :value="Number(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
            </template>
          </BaseField>
        </div>

        <BaseField label="Estado" required>
          <template #default="{ fieldId }">
            <select :id="fieldId" v-model="status" class="field-input" required>
              <option
                v-for="option in SEMESTER_STATUS_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
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
          <BaseButton type="submit" :disabled="isSubmitting">
            <AppIcon :name="isEditing ? 'pencil' : 'plus'" :size="16" />
            {{
              isSubmitting
                ? isEditing
                  ? 'Guardando...'
                  : 'Creando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear semestre'
            }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
