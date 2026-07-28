import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

import { createId } from '@/utils/id.util'
import type { Tone } from '@/utils/tone.util'

export interface Toast {
  id: string
  message: string
  tone: Tone
}

const AUTO_DISMISS_MS = 3500

// Estado compartido por toda la aplicacion: se declara fuera del composable.
const toasts = ref<Toast[]>([])

export interface ToastApi {
  toasts: DeepReadonly<Ref<Toast[]>>
  notify: (message: string, tone?: Tone) => void
  success: (message: string) => void
  error: (message: string) => void
  dismiss: (id: string) => void
}

export function useToast(): ToastApi {
  function dismiss(id: string): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function notify(message: string, tone: Tone = 'brand'): void {
    const toast: Toast = { id: createId(), message, tone }
    toasts.value = [...toasts.value, toast]
    window.setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS)
  }

  return {
    toasts: readonly(toasts),
    notify,
    success: (message: string) => notify(message, 'success'),
    error: (message: string) => notify(message, 'danger'),
    dismiss,
  }
}
