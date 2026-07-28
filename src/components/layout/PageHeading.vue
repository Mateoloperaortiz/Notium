<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

import AppIcon from '@/components/base/AppIcon.vue'

withDefaults(
  defineProps<{ title: string; description?: string; backTo?: RouteLocationRaw | null }>(),
  { description: '', backTo: null },
)
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <RouterLink
        v-if="backTo"
        :to="backTo"
        class="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-brand-700"
      >
        <AppIcon name="arrow-left" :size="16" />
        Volver
      </RouterLink>
      <h1 class="text-2xl font-semibold tracking-tight text-ink-900">{{ title }}</h1>
      <p v-if="description !== ''" class="mt-1 max-w-2xl text-sm text-ink-500">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
