<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBreathingStore } from '@/stores/breathingStore'
import { BreathPhase } from '@/types'
import BreathingCircle from '@/components/BreathingCircle.vue'

const store = useBreathingStore()
const router = useRouter()

// Check if session is active
const isSessionActive = computed(() => store.session.isRunning)

// Check if session is completed
const isSessionCompleted = computed(() => 
  store.session.currentPhase === BreathPhase.COMPLETED
)

// Start the breathing session
function startSession() {
  store.startSession()
}

// Stop the current session
function stopSession() {
  store.stopSession()
}

// Reset to menu state (initial state without starting a new session)
function resetToMenu() {
  store.resetSession()
}

// Go to settings page
function goToSettings() {
  // If a session is active, stop it
  if (isSessionActive.value) {
    stopSession()
  }
  router.push('/settings')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Take a breath</h1>
    
    <div class="flex flex-col items-center justify-center">
      <!-- Breathing circle component -->
      <BreathingCircle class="mb-8" />
      
      <!-- Start button when no active session and not completed -->
      <div v-if="!isSessionActive && !isSessionCompleted" class="flex justify-center">
        <button 
          @click="startSession" 
          class="px-10 py-4 bg-blue-500 dark:bg-black dark:text-neon-green text-white text-lg rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-neon-green/20 transition shadow-md dark:shadow-neon-green/50"
        >
          Start
        </button>
      </div>
      
      <!-- Start Over and To Menu buttons when completed -->
      <div v-if="isSessionCompleted" class="flex justify-center space-x-4">
        <button 
          @click="startSession" 
          class="px-10 py-4 bg-blue-500 dark:bg-black dark:text-neon-green text-white text-lg rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-neon-green/20 transition shadow-md dark:shadow-neon-green/50"
        >
          Start Over
        </button>
        <button 
          @click="resetToMenu" 
          class="px-10 py-4 bg-gray-500 dark:bg-black dark:text-neon-blue text-white text-lg rounded-lg font-semibold hover:bg-gray-600 dark:hover:bg-neon-blue/20 transition shadow-md dark:shadow-neon-blue/50"
        >
          To Menu
        </button>
      </div>
      
      <!-- Stop button when session is active -->
      <div v-if="isSessionActive && !isSessionCompleted" class="flex justify-center">
        <button 
          @click="stopSession" 
          class="px-10 py-4 bg-red-500 dark:bg-black dark:text-neon-pink text-white text-lg rounded-lg font-semibold hover:bg-red-600 dark:hover:bg-neon-pink/20 transition shadow-md dark:shadow-neon-pink/50"
        >
          Stop
        </button>
      </div>
    </div>
  </div>
</template> 