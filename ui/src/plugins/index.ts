/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
import { createRouter, createWebHashHistory } from 'vue-router'


// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../stores'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

// Types
import type { App } from 'vue'

// Router
const routes = setupLayouts(generatedRoutes)
export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export function registerPlugins (app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
