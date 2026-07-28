<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{ open: boolean; title: string; subtitle?: string }>(), {
  subtitle: '',
})

const emit = defineEmits<{ close: [] }>()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    if (isOpen) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div class="w-full max-w-xl rounded-2xl bg-white shadow-xl">
          <header class="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-4">
            <div>
              <h2 class="text-base font-semibold text-ink-900">{{ title }}</h2>
              <p v-if="subtitle !== ''" class="mt-0.5 text-sm text-ink-500">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              aria-label="Cerrar"
              @click="emit('close')"
            >
              <span aria-hidden="true" class="text-lg leading-none">&times;</span>
            </button>
          </header>
          <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
            <slot />
          </div>
          <footer
            v-if="$slots.footer"
            class="flex justify-end gap-2 border-t border-ink-100 px-6 py-4"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 150ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
