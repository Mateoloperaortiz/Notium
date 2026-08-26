<script setup lang="ts">
import { computed, ref } from 'vue'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseField from '@/components/base/BaseField.vue'
import type { CreateSubjectDTO, UpdateSubjectDTO } from '@/dto/CreateSubjectDTO'
import type { Subject } from '@/models'
import { useAuthStore } from '@/stores/auth.store'
import { useSemesterStore } from '@/stores/semester.store'
import { useSubjectStore } from '@/stores/subject.store'
import { useToast } from '@/composables/useToast'

const props = withDefaults(defineProps<{ subject?: Subject | null }>(), { subject: null })
const emit = defineEmits<{ cancel: []; created: []; updated: [] }>()

const auth = useAuthStore()
const semesterStore = useSemesterStore()
const subjectStore = useSubjectStore()
const { success } = useToast()

const userSemesters = computed(() => {
  const userId = auth.currentUser?.id
  return userId === undefined ? [] : semesterStore.listByUser(userId)
})

const code = ref(props.subject?.code ?? '')
const name = ref(props.subject?.name ?? '')
const credits = ref(props.subject?.credits ?? 1)
const professor = ref(props.subject?.professor ?? '')
const semesterId = ref(props.subject?.semesterId ?? '')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isEditing = props.subject !== null

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

  const commonData = {
    code: code.value,
    name: name.value,
    credits: credits.value,
    professor: professor.value,
    semesterId: semesterId.value,
  }

  const result =
    isEditing && props.subject !== null
      ? subjectStore.updateSubject(props.subject.id, commonData satisfies UpdateSubjectDTO)
      : subjectStore.createSubject(commonData satisfies CreateSubjectDTO)

  isSubmitting.value = false
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }

  success(isEditing ? 'Materia actualizada correctamente.' : 'Materia creada correctamente.')
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
        <AppIcon name="book" />
      </span>
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-ink-900">
          {{ isEditing ? 'Editar materia' : 'Nueva materia' }}
        </h1>
        <p class="mt-1 text-sm text-ink-500">
          {{
            isEditing
              ? 'Actualiza los datos de esta materia.'
              : 'Registra una materia dentro de uno de tus semestres.'
          }}
        </p>
      </div>
    </div>

    <BaseCard
      title="Informacion de la materia"
      description="Completa los datos principales de la materia."
    >
      <form class="space-y-5" @submit.prevent="submit">
        <div class="grid gap-5 sm:grid-cols-2">
          <BaseField label="Codigo" hint="Por ejemplo: MAT-101" required>
            <template #default="{ fieldId }">
              <input
                :id="fieldId"
                v-model="code"
                type="text"
                required
                placeholder="MAT-101"
                class="field-input"
              />
            </template>
          </BaseField>

          <BaseField label="Creditos" required>
            <template #default="{ fieldId }">
              <input
                :id="fieldId"
                v-model.number="credits"
                type="number"
                min="1"
                step="1"
                required
                class="field-input"
              />
            </template>
          </BaseField>
        </div>

        <BaseField label="Nombre" required>
          <template #default="{ fieldId }">
            <input
              :id="fieldId"
              v-model="name"
              type="text"
              required
              placeholder="Matematicas discretas"
              class="field-input"
            />
          </template>
        </BaseField>

        <BaseField label="Profesor" required>
          <template #default="{ fieldId }">
            <input
              :id="fieldId"
              v-model="professor"
              type="text"
              required
              placeholder="Nombre del profesor"
              class="field-input"
            />
          </template>
        </BaseField>

        <BaseField label="Semestre" required>
          <template #default="{ fieldId }">
            <select :id="fieldId" v-model="semesterId" class="field-input" required>
              <option value="" disabled>Selecciona un semestre</option>
              <option v-for="semester in userSemesters" :key="semester.id" :value="semester.id">
                {{ semester.name }} - {{ semester.year }} / Periodo {{ semester.period }}
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
          <BaseButton
            type="submit"
            :disabled="isSubmitting || (!isEditing && userSemesters.length === 0)"
          >
            <AppIcon :name="isEditing ? 'pencil' : 'plus'" :size="16" />
            {{
              isSubmitting
                ? isEditing
                  ? 'Guardando...'
                  : 'Creando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear materia'
            }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
