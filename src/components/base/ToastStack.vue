<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { toneClasses } from '@/utils/tone.util'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 bottom-6 z-60 flex flex-col items-center gap-2">
      <TransitionGroup name="toast">
        <button
          v-for="toast in toasts"
          :key="toast.id"
          type="button"
          :class="`pointer-events-auto rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg ring-1 ${toneClasses(toast.tone)}`"
          @click="dismiss(toast.id)"
        >
          {{ toast.message }}
        </button>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 200ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
