<script setup lang="ts">
withDefaults(defineProps<{ message: string; title?: string }>(), { title: '' })
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-10 text-center"
  >
    <p v-if="title !== ''" class="text-sm font-semibold text-ink-700">{{ title }}</p>
    <p class="max-w-md text-sm text-ink-500">{{ message }}</p>
    <div v-if="$slots.default" class="mt-2">
      <slot />
    </div>
  </div>
</template>
