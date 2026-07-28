import { readonly, ref } from 'vue'
import type { DeepReadonly, Ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean
}

const CLOSED_STATE: ConfirmState = { isOpen: false, title: '', message: '' }

const state = ref<ConfirmState>({ ...CLOSED_STATE })
let resolvePending: ((confirmed: boolean) => void) | null = null

export interface ConfirmApi {
  state: DeepReadonly<Ref<ConfirmState>>
  confirm: (options: ConfirmOptions) => Promise<boolean>
  resolve: (confirmed: boolean) => void
}

/** Dialogo de confirmacion unico para todas las acciones destructivas. */
export function useConfirm(): ConfirmApi {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    state.value = { ...options, isOpen: true }
    return new Promise<boolean>((resolvePromise) => {
      resolvePending = resolvePromise
    })
  }

  function resolve(confirmed: boolean): void {
    state.value = { ...CLOSED_STATE }
    resolvePending?.(confirmed)
    resolvePending = null
  }

  return { state: readonly(state), confirm, resolve }
}
