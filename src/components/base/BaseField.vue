<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label: string; hint?: string; error?: string; required?: boolean }>()

/** Identificador estable para asociar la etiqueta con el control del slot. */
const fieldId = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="fieldId" class="text-sm font-medium text-ink-700">
      {{ label }}
      <span v-if="required" class="text-rose-600">*</span>
    </label>
    <slot :field-id="fieldId" />
    <p v-if="error" class="text-xs text-rose-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-ink-400">{{ hint }}</p>
  </div>
</template>
