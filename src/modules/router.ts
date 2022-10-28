import type { App } from 'vue'
import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes as fileRoutes } from 'vue-router/auto/routes'

export const router = createRouter({
	history: createWebHashHistory(),
	routes: setupLayouts(fileRoutes),
})

export default (app: App) => app.use(router)
