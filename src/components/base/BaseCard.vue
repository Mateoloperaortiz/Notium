<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string; padded?: boolean }>(), {
  title: '',
  description: '',
  padded: true,
})
</script>

<template>
  <section class="rounded-2xl border border-ink-100 bg-white shadow-sm">
    <header
      v-if="title !== '' || $slots.actions"
      class="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4"
    >
      <div>
        <h2 class="text-base font-semibold text-ink-900">{{ title }}</h2>
        <p v-if="description !== ''" class="mt-0.5 text-sm text-ink-500">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div :class="padded ? 'p-5' : ''">
      <slot />
    </div>
  </section>
</template>
