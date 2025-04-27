import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import './assets/darkmode.css'

// Import routes
import Home from './views/Home.vue'
import Settings from './views/Settings.vue'

// Get the base URL - empty string for dev, '/breath-thesis/' for production
// @ts-ignore - handle BASE_URL from Vite
const baseUrl = import.meta.env?.BASE_URL || '/'

// Create router instance
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/settings', component: Settings, name: 'settings' }
  ]
})

// Create pinia store
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
