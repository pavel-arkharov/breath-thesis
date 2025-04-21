import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { BreathPhase, TimerSet, BreathingExercise, SessionState, TimerFormat } from '@/types'

// Utility to save and retrieve data from local storage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (e) {
    console.error('Error reading from localStorage:', e)
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Error writing to localStorage:', e)
  }
}

// Direct DOM manipulations for dark mode
const enableDarkMode = (): void => {
  // Apply the dark class to document element for Tailwind dark mode
  document.documentElement.classList.add('dark')
  
  // Set a data attribute for additional CSS hooks 
  document.documentElement.setAttribute('data-theme', 'dark')
  
  // Force a reflow to ensure style changes are applied immediately
  document.documentElement.style.color = document.documentElement.style.color
}

const disableDarkMode = (): void => {
  // Remove the dark class
  document.documentElement.classList.remove('dark')
  
  // Remove the data attribute
  document.documentElement.setAttribute('data-theme', 'light')
  
  // Force a reflow to ensure style changes are applied immediately
  document.documentElement.style.color = document.documentElement.style.color
}

// Apply dark mode class to document
const applyDarkMode = (isDark: boolean): void => {
  console.log('Applying dark mode:', isDark)
  
  if (isDark) {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
  
  // Set a specific meta tag for some browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#f9fafb')
  }
}

// Check system preference for dark mode
const getSystemDarkMode = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Define the breathing store
export const useBreathingStore = defineStore('breathing', () => {
  // Default timer set (4-4-4-4)
  const defaultTimerSet: TimerSet = {
    id: uuidv4(),
    inhaleTime: 4,
    holdAfterInhaleTime: 4,
    exhaleTime: 4,
    holdAfterExhaleTime: 4
  }

  // Default exercise with one timer set and 3 rounds
  const defaultExercise: BreathingExercise = {
    timerSets: [defaultTimerSet],
    rounds: 3
  }

  // Current exercise configuration (loaded from localStorage or default)
  const currentExercise = ref<BreathingExercise>(
    getFromStorage<BreathingExercise>('currentExercise', defaultExercise)
  )

  // Session state
  const session = ref<SessionState>({
    currentPhase: BreathPhase.PREPARE,
    currentRound: 1,
    currentSetIndex: 0,
    timeRemaining: 3, // 3 seconds prepare time
    isRunning: false,
    totalRounds: currentExercise.value.rounds
  })

  // Flag to indicate if we're at zero and should wait before transitioning
  const isWaitingAtZero = ref(false)

  // Dark mode state
  const isDarkMode = ref(false)
  
  // Initialize dark mode based on saved preference or system preference
  const initializeDarkMode = (): void => {
    // First check localStorage for saved preference
    const savedMode = localStorage.getItem('darkMode')
    
    if (savedMode !== null) {
      // User has a saved preference
      const darkModeEnabled = savedMode === 'true'
      isDarkMode.value = darkModeEnabled
      
      if (darkModeEnabled) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }
    } else {
      // No saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
      
      if (prefersDark) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }
    }
  }
  
  // Toggle dark mode
  const toggleDarkMode = (): void => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    
    if (isDarkMode.value) {
      enableDarkMode()
    } else {
      disableDarkMode()
    }
  }
  
  // Initialize dark mode on store creation
  initializeDarkMode()
  
  // Watch for system preference changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeMediaQuery.addEventListener('change', (e) => {
    // Only apply system preference if user hasn't set their own preference
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = e.matches
      if (e.matches) {
        enableDarkMode()
      } else {
        disableDarkMode()
      }
    }
  })
  
  // Timer format preference (defaults to SIMPLE)
  const timerFormat = ref<TimerFormat>(getFromStorage<TimerFormat>('timerFormat', TimerFormat.SIMPLE))

  // Timer reference for the interval
  let timerInterval: number | undefined
  
  // Timeout reference for zero-waiting
  let zeroWaitTimeout: number | undefined

  // Current timer set getter
  const currentTimerSet = computed<TimerSet>(() => {
    return currentExercise.value.timerSets[session.value.currentSetIndex]
  })

  // Get current phase time based on the current phase
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

  // Add a new timer set
  function addTimerSet() {
    currentExercise.value.timerSets.push({
      id: uuidv4(),
      inhaleTime: 4,
      holdAfterInhaleTime: 4,
      exhaleTime: 4,
      holdAfterExhaleTime: 4
    })
    saveExercise()
  }

  // Remove a timer set by id
  function removeTimerSet(id: string) {
    if (currentExercise.value.timerSets.length <= 1) return
    
    currentExercise.value.timerSets = currentExercise.value.timerSets.filter(
      set => set.id !== id
    )
    saveExercise()
  }

  // Update a timer set
  function updateTimerSet(id: string, updates: Partial<TimerSet>) {
    const index = currentExercise.value.timerSets.findIndex(set => set.id === id)
    if (index === -1) return
    
    currentExercise.value.timerSets[index] = {
      ...currentExercise.value.timerSets[index],
      ...updates
    }
    saveExercise()
  }

  // Update number of rounds
  function updateRounds(rounds: number) {
    currentExercise.value.rounds = rounds
    session.value.totalRounds = rounds
    saveExercise()
  }

  // Save the current exercise to localStorage
  function saveExercise() {
    saveToStorage('currentExercise', currentExercise.value)
  }

  // Toggle timer format between SIMPLE and TIME
  function toggleTimerFormat() {
    timerFormat.value = timerFormat.value === TimerFormat.SIMPLE 
      ? TimerFormat.TIME 
      : TimerFormat.SIMPLE
    
    saveToStorage('timerFormat', timerFormat.value)
  }

  // Start the breathing session
  function startSession() {
    // Clear any existing timers/intervals to avoid conflicts
    clearAllTimers()
    
    // Reset session state
    session.value = {
      currentPhase: BreathPhase.PREPARE,
      currentRound: 1,
      currentSetIndex: 0,
      timeRemaining: 3, // Start with 3-second countdown
      isRunning: true,
      totalRounds: currentExercise.value.rounds
    }
    
    isWaitingAtZero.value = false
    
    // Start the timer
    timerInterval = window.setInterval(updateTimer, 1000)
  }

  // Stop the breathing session
  function stopSession() {
    session.value.isRunning = false
    clearAllTimers()
    session.value.currentPhase = BreathPhase.COMPLETED
  }

  // Helper to clear all timers
  function clearAllTimers() {
    if (timerInterval) clearInterval(timerInterval)
    if (zeroWaitTimeout) clearTimeout(zeroWaitTimeout)
    timerInterval = undefined
    zeroWaitTimeout = undefined
  }

  // Update timer and manage phase transitions
  function updateTimer() {
    if (!session.value.isRunning) return
    
    // If we're waiting at zero, don't update anything
    if (isWaitingAtZero.value) return
    
    // Decrease time remaining
    session.value.timeRemaining--
    
    // If time reaches zero, wait for a moment before moving to next phase
    if (session.value.timeRemaining <= 0) {
      isWaitingAtZero.value = true
      
      // Stay at 0 for 1 second before transitioning
      zeroWaitTimeout = window.setTimeout(() => {
        moveToNextPhase()
        isWaitingAtZero.value = false
      }, 1000)
    }
  }

  // Move to the next phase in the breathing sequence
  function moveToNextPhase() {
    switch (session.value.currentPhase) {
      case BreathPhase.PREPARE:
        session.value.currentPhase = BreathPhase.INHALE
        session.value.timeRemaining = currentTimerSet.value.inhaleTime
        break
        
      case BreathPhase.INHALE:
        session.value.currentPhase = BreathPhase.HOLD_AFTER_INHALE
        session.value.timeRemaining = currentTimerSet.value.holdAfterInhaleTime
        break
        
      case BreathPhase.HOLD_AFTER_INHALE:
        session.value.currentPhase = BreathPhase.EXHALE
        session.value.timeRemaining = currentTimerSet.value.exhaleTime
        break
        
      case BreathPhase.EXHALE:
        session.value.currentPhase = BreathPhase.HOLD_AFTER_EXHALE
        session.value.timeRemaining = currentTimerSet.value.holdAfterExhaleTime
        break
        
      case BreathPhase.HOLD_AFTER_EXHALE:
        // Check if we need to move to the next set or round
        const nextSetIndex = session.value.currentSetIndex + 1
        
        // If we have more sets in this round
        if (nextSetIndex < currentExercise.value.timerSets.length) {
          session.value.currentSetIndex = nextSetIndex
          session.value.currentPhase = BreathPhase.INHALE
          session.value.timeRemaining = currentExercise.value.timerSets[nextSetIndex].inhaleTime
        } 
        // If we've completed all sets in this round, go to next round
        else {
          const nextRound = session.value.currentRound + 1
          
          // If we've completed all rounds, end the session
          if (nextRound > session.value.totalRounds) {
            stopSession()
          } 
          // Otherwise, start the next round
          else {
            session.value.currentRound = nextRound
            session.value.currentSetIndex = 0
            session.value.currentPhase = BreathPhase.INHALE
            session.value.timeRemaining = currentExercise.value.timerSets[0].inhaleTime
          }
        }
        break
    }
  }

  // Format time based on the current timer format setting
  function formatTime(seconds: number): string {
    if (timerFormat.value === TimerFormat.SIMPLE) {
      return seconds.toString()
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }

  return {
    currentExercise,
    session,
    isDarkMode,
    timerFormat,
    currentTimerSet,
    currentPhaseTime,
    isWaitingAtZero,
    addTimerSet,
    removeTimerSet,
    updateTimerSet,
    updateRounds,
    saveExercise,
    toggleDarkMode,
    toggleTimerFormat,
    formatTime,
    startSession,
    stopSession
  }
}) 