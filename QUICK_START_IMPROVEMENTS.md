# Quick Start: Immediate Improvements

This guide provides ready-to-use code for the most impactful improvements.

## 1. Install Recommended Libraries

```bash
# Core improvements
npm install pinia-plugin-persistedstate zod

# Development tools
npm install -D @antfu/eslint-config eslint prettier
npm install -D vitest @vue/test-utils jsdom

# Optional but recommended
npm install vue-toastification
```

## 2. Storage Service (Copy & Paste Ready)

Create `src/services/storageService.ts`:

```typescript
import { ErrorService } from './errorService'

export class StorageService {
  private static readonly PREFIX = 'breath-app:'
  private static readonly VERSION_KEY = 'breath-app:version'
  private static readonly CURRENT_VERSION = '1.0.0'

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.PREFIX + key)
      if (!item) return defaultValue
      
      const parsed = JSON.parse(item)
      return parsed as T
    } catch (error) {
      ErrorService.handleError(error as Error, `Storage.get(${key})`)
      return defaultValue
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value))
    } catch (error) {
      ErrorService.handleError(error as Error, `Storage.set(${key})`)
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key)
    } catch (error) {
      ErrorService.handleError(error as Error, `Storage.remove(${key})`)
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys
        .filter(key => key.startsWith(this.PREFIX))
        .forEach(key => localStorage.removeItem(key))
    } catch (error) {
      ErrorService.handleError(error as Error, 'Storage.clear()')
    }
  }

  static migrate(oldVersion: string, newVersion: string): void {
    // Add migration logic here when needed
    console.log(`Migrating from ${oldVersion} to ${newVersion}`)
  }
}
```

## 3. Error Service (Copy & Paste Ready)

Create `src/services/errorService.ts`:

```typescript
export class ErrorService {
  private static errorLog: Error[] = []

  static handleError(error: Error, context?: string): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error:', errorInfo)
    }

    // Store for potential reporting
    this.errorLog.push(error)

    // Future: Send to error tracking service (Sentry, etc.)
    // this.reportError(errorInfo)
  }

  static logError(error: Error, metadata?: Record<string, unknown>): void {
    this.handleError(error, JSON.stringify(metadata))
  }

  static showUserError(message: string): void {
    // Future: Use toast notification
    console.warn('User Error:', message)
    // Example with vue-toastification:
    // toast.error(message)
  }

  static getErrorLog(): Error[] {
    return [...this.errorLog]
  }

  static clearErrorLog(): void {
    this.errorLog = []
  }
}
```

## 4. Dark Mode Composable (Using @vueuse/core)

Create `src/composables/useDarkMode.ts`:

```typescript
import { useDark, useToggle } from '@vueuse/core'
import { watch } from 'vue'

export function useDarkMode() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'breath-app:darkMode',
    storage: localStorage
  })

  const toggle = useToggle(isDark)

  // Update meta theme color
  watch(isDark, (dark) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', dark ? '#1f2937' : '#f9fafb')
    }
  }, { immediate: true })

  return {
    isDark,
    toggle
  }
}
```

**Update store to use composable:**

```typescript
// In stores/preferencesStore.ts
import { defineStore } from 'pinia'
import { useDarkMode } from '@/composables/useDarkMode'

export const usePreferencesStore = defineStore('preferences', () => {
  const { isDark, toggle } = useDarkMode()

  return {
    isDark,
    toggleDarkMode: toggle
  }
})
```

## 5. Timer Composable (Using @vueuse/core)

Create `src/composables/useBreathingTimer.ts`:

```typescript
import { ref, onBeforeUnmount } from 'vue'
import { useIntervalFn } from '@vueuse/core'

export function useBreathingTimer(
  callback: () => void,
  interval: number = 1000
) {
  const isRunning = ref(false)
  const isPaused = ref(false)

  const { pause, resume, isActive } = useIntervalFn(
    callback,
    interval,
    { immediate: false }
  )

  const start = () => {
    isRunning.value = true
    isPaused.value = false
    resume()
  }

  const stop = () => {
    isRunning.value = false
    isPaused.value = false
    pause()
  }

  const pauseTimer = () => {
    if (isRunning.value) {
      isPaused.value = true
      pause()
    }
  }

  const resumeTimer = () => {
    if (isPaused.value) {
      isPaused.value = false
      resume()
    }
  }

  const reset = () => {
    stop()
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    stop()
  })

  return {
    isRunning,
    isPaused,
    start,
    stop,
    pause: pauseTimer,
    resume: resumeTimer,
    reset
  }
}
```

## 6. Split Store: Exercise Store

Create `src/stores/exerciseStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { TimerSet, BreathingExercise } from '@/types'
import { StorageService } from '@/services/storageService'

const defaultTimerSet: TimerSet = {
  id: uuidv4(),
  inhaleTime: 4,
  holdAfterInhaleTime: 4,
  exhaleTime: 4,
  holdAfterExhaleTime: 4
}

const defaultExercise: BreathingExercise = {
  timerSets: [defaultTimerSet],
  rounds: 3
}

export const useExerciseStore = defineStore('exercise', {
  state: () => ({
    currentExercise: StorageService.get<BreathingExercise>(
      'currentExercise',
      defaultExercise
    )
  }),

  actions: {
    addTimerSet() {
      this.currentExercise.timerSets.push({
        id: uuidv4(),
        inhaleTime: 4,
        holdAfterInhaleTime: 4,
        exhaleTime: 4,
        holdAfterExhaleTime: 4
      })
      this.saveExercise()
    },

    removeTimerSet(id: string) {
      if (this.currentExercise.timerSets.length <= 1) return
      
      this.currentExercise.timerSets = this.currentExercise.timerSets.filter(
        set => set.id !== id
      )
      this.saveExercise()
    },

    updateTimerSet(id: string, updates: Partial<TimerSet>) {
      const index = this.currentExercise.timerSets.findIndex(
        set => set.id === id
      )
      if (index === -1) return
      
      this.currentExercise.timerSets[index] = {
        ...this.currentExercise.timerSets[index],
        ...updates
      }
      this.saveExercise()
    },

    updateRounds(rounds: number) {
      this.currentExercise.rounds = rounds
      this.saveExercise()
    },

    saveExercise() {
      StorageService.set('currentExercise', this.currentExercise)
    }
  }
})
```

## 7. Split Store: Session Store

Create `src/stores/sessionStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BreathPhase, SessionState, TimerSet } from '@/types'
import { useBreathingTimer } from '@/composables/useBreathingTimer'
import { useExerciseStore } from './exerciseStore'

export const useSessionStore = defineStore('session', () => {
  const exerciseStore = useExerciseStore()

  const session = ref<SessionState>({
    currentPhase: BreathPhase.STANDBY,
    currentRound: 1,
    currentSetIndex: 0,
    timeRemaining: 3,
    isRunning: false,
    totalRounds: exerciseStore.currentExercise.rounds
  })

  const isWaitingAtZero = ref(false)
  let zeroWaitTimeout: number | undefined

  const currentTimerSet = computed<TimerSet>(() => {
    return exerciseStore.currentExercise.timerSets[session.value.currentSetIndex]
  })

  const currentPhaseTime = computed<number>(() => {
    if (session.value.currentPhase === BreathPhase.PREPARE) return 3
    
    const set = currentTimerSet.value
    switch (session.value.currentPhase) {
      case BreathPhase.INHALE:
        return set.inhaleTime
      case BreathPhase.HOLD_AFTER_INHALE:
        return set.holdAfterInhaleTime
      case BreathPhase.EXHALE:
        return set.exhaleTime
      case BreathPhase.HOLD_AFTER_EXHALE:
        return set.holdAfterExhaleTime
      default:
        return 0
    }
  })

  const timer = useBreathingTimer(() => {
    updateTimer()
  }, 1000)

  function updateTimer() {
    if (!session.value.isRunning) return
    if (isWaitingAtZero.value) return
    
    session.value.timeRemaining--
    
    if (session.value.timeRemaining <= 0) {
      isWaitingAtZero.value = true
      zeroWaitTimeout = window.setTimeout(() => {
        moveToNextPhase()
        isWaitingAtZero.value = false
      }, 1000)
    }
  }

  function moveToNextPhase() {
    // Phase transition logic here
    // (Move from current implementation)
  }

  function startSession() {
    timer.stop()
    
    session.value = {
      currentPhase: BreathPhase.PREPARE,
      currentRound: 1,
      currentSetIndex: 0,
      timeRemaining: 3,
      isRunning: true,
      totalRounds: exerciseStore.currentExercise.rounds
    }
    
    isWaitingAtZero.value = false
    timer.start()
  }

  function stopSession() {
    session.value.isRunning = false
    timer.stop()
    if (zeroWaitTimeout) clearTimeout(zeroWaitTimeout)
    session.value.currentPhase = BreathPhase.COMPLETED
  }

  function resetSession() {
    session.value = {
      currentPhase: BreathPhase.STANDBY,
      currentRound: 1,
      currentSetIndex: 0,
      timeRemaining: 3,
      isRunning: false,
      totalRounds: exerciseStore.currentExercise.rounds
    }
    timer.stop()
    if (zeroWaitTimeout) clearTimeout(zeroWaitTimeout)
    isWaitingAtZero.value = false
  }

  return {
    session,
    isWaitingAtZero,
    currentTimerSet,
    currentPhaseTime,
    startSession,
    stopSession,
    resetSession
  }
})
```

## 8. Split Store: Preferences Store

Create `src/stores/preferencesStore.ts`:

```typescript
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { TimerFormat } from '@/types'
import { useDarkMode } from '@/composables/useDarkMode'

export const usePreferencesStore = defineStore('preferences', () => {
  const { isDark, toggle } = useDarkMode()
  
  const timerFormat = useLocalStorage<TimerFormat>(
    'breath-app:timerFormat',
    TimerFormat.SIMPLE
  )

  function toggleTimerFormat() {
    timerFormat.value = timerFormat.value === TimerFormat.SIMPLE
      ? TimerFormat.TIME
      : TimerFormat.SIMPLE
  }

  return {
    isDark,
    toggleDarkMode: toggle,
    timerFormat,
    toggleTimerFormat
  }
})
```

## 9. Update main.ts for Persisted State

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './style.css'
import './assets/darkmode.css'

import Home from './views/Home.vue'
import Settings from './views/Settings.vue'

const baseUrl = '/'

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/settings', component: Settings, name: 'settings' }
  ]
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
```

## 10. Update Components to Use New Stores

**Example: Update Home.vue**

```typescript
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/sessionStore'
import { useExerciseStore } from '@/stores/exerciseStore'
import { BreathPhase } from '@/types'
import BreathingCircle from '@/components/BreathingCircle.vue'
import BreathingPresets from '@/components/BreathingPresets.vue'

const sessionStore = useSessionStore()
const exerciseStore = useExerciseStore()
const router = useRouter()

const isSessionActive = computed(() => sessionStore.session.isRunning)
const isSessionCompleted = computed(() => 
  sessionStore.session.currentPhase === BreathPhase.COMPLETED
)
const isStandby = computed(() => 
  sessionStore.session.currentPhase === BreathPhase.STANDBY
)

function startSession() {
  sessionStore.startSession()
}

function stopSession() {
  sessionStore.stopSession()
}

function resetToMenu() {
  sessionStore.resetSession()
}

function goToSettings() {
  if (isSessionActive.value) {
    stopSession()
  }
  router.push('/settings')
}
</script>
```

## 11. ESLint Configuration

Create `.eslintrc.cjs`:

```javascript
module.exports = {
  extends: ['@antfu'],
  rules: {
    // Customize as needed
  }
}
```

## 12. Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## Migration Checklist

- [ ] Install recommended libraries
- [ ] Create `services/` folder and add storage & error services
- [ ] Create `composables/` folder and add dark mode & timer composables
- [ ] Split `breathingStore.ts` into 3 focused stores
- [ ] Update `main.ts` to use persisted state plugin
- [ ] Update components to use new stores
- [ ] Test all functionality
- [ ] Remove old store file
- [ ] Update imports across codebase

## Next Steps

1. Start with storage service (low risk, high value)
2. Extract dark mode composable (uses @vueuse/core you already have)
3. Split stores one at a time (exercise → session → preferences)
4. Update components incrementally
5. Add tests as you refactor

## Need Help?

Each step can be done independently. Start with what feels safest and work your way up! 🚀

