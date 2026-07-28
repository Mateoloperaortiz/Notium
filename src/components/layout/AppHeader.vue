<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppIcon from '@/components/base/AppIcon.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { env } from '@/config/env'
import { UserRole, userRoleLabel } from '@/models'
import { RouteName } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'

const auth = useAuthStore()
const router = useRouter()
const { notify } = useToast()

async function logout(): Promise<void> {
  auth.logout()
  notify('Sesion cerrada.')
  await router.push({ name: RouteName.Home })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <RouterLink :to="{ name: RouteName.Home }" class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white"
        >
          N
        </span>
        <span class="text-lg font-semibold tracking-tight text-ink-900">{{ env.appName }}</span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <template v-if="auth.isAuthenticated">
          <div class="mr-2 hidden text-right sm:block">
            <p class="text-sm font-medium text-ink-800">{{ auth.displayName }}</p>
            <BaseBadge :tone="auth.isAdmin ? 'brand' : 'info'">
              {{ userRoleLabel(auth.currentUser?.role ?? UserRole.Student) }}
            </BaseBadge>
          </div>
          <BaseButton variant="secondary" size="sm" @click="logout">
            <AppIcon name="logout" :size="16" />
            Salir
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton variant="primary" size="sm" @click="router.push({ name: RouteName.Login })">
            Iniciar sesion
          </BaseButton>
        </template>
      </nav>
    </div>
  </header>
</template>
