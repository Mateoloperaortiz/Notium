<script setup lang="ts">
import { computed } from 'vue'

import { toneClasses } from '@/utils/tone.util'
import type { Tone } from '@/utils/tone.util'

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'neutral' })

const classes = computed<string>(
  () =>
    `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClasses(props.tone)}`,
)
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
