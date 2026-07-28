<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import ToastStack from '@/components/base/ToastStack.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const auth = useAuthStore()

/** Las paginas publicas (inicio y acceso) se muestran a ancho completo. */
const showSidebar = computed<boolean>(
  () => auth.isAuthenticated && route.meta.requiresAuth === true,
)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <div class="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:flex-row">
      <AppSidebar v-if="showSidebar" />
      <main class="min-w-0 flex-1">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <AppFooter />
    <ToastStack />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 120ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
