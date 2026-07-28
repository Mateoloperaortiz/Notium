import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'
import { seedService } from './services/seed.service'
import { useAuthStore } from './stores/auth.store'
import './assets/main.css'

async function bootstrap(): Promise<void> {
  const app = createApp(App)
  app.use(createPinia())

  // Los datos ficticios deben existir antes de que cualquier store lea LocalStorage.
  await seedService.ensureSeed()
  useAuthStore().restoreSession()

  app.use(router)
  await router.isReady()
  app.mount('#app')
}

void bootstrap()
