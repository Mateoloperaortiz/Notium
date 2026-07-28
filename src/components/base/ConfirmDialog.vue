<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import { useConfirm } from '@/composables/useConfirm'

const { state, resolve } = useConfirm()
</script>

<template>
  <BaseModal :open="state.isOpen" :title="state.title" @close="resolve(false)">
    <p class="text-sm text-ink-600">{{ state.message }}</p>
    <template #footer>
      <BaseButton variant="secondary" @click="resolve(false)">
        {{ state.cancelLabel ?? 'Cancelar' }}
      </BaseButton>
      <BaseButton :variant="state.destructive ? 'danger' : 'primary'" @click="resolve(true)">
        {{ state.confirmLabel ?? 'Confirmar' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
