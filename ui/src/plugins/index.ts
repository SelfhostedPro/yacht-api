/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
import { createRouter, createWebHashHistory } from 'vue-router'


// Plugins
import { loadFonts } from '@/plugins/webfontloader'
import vuetify from '@/plugins/vuetify'
import pinia from '@/stores'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'


// Types
import type { App } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

// Router
const routes = setupLayouts(generatedRoutes)
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPage = to.meta.public

  const authStore = useAuthStore();
  const { user, returnUrl } = storeToRefs(authStore)

  if (!publicPage && !user.value) {
    returnUrl.value = to.fullPath;
    return '/login';
  }
});


export function registerPlugins(app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
