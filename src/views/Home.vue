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
    <h1 class="text-3xl font-bold mb-6 text-center">Breathing Trainer</h1>
    
    <div class="flex flex-col items-center justify-center">
      <!-- Breathing circle component -->
      <BreathingCircle class="mb-8" />
      
      <!-- Controls when no session is active -->
      <div v-if="!isSessionActive && !isSessionCompleted" class="flex gap-4">
        <button 
          @click="startSession" 
          class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Start
        </button>
        <button 
          @click="goToSettings" 
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Settings
        </button>
      </div>
      
      <!-- Controls when session is active -->
      <div v-if="isSessionActive && !isSessionCompleted" class="flex gap-4">
        <button 
          @click="stopSession" 
          class="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Stop
        </button>
      </div>
      
      <!-- Controls when session is completed -->
      <div v-if="isSessionCompleted" class="flex gap-4">
        <button 
          @click="startSession" 
          class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Start Again
        </button>
        <button 
          @click="goToSettings" 
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Settings
        </button>
      </div>
    </div>
  </div>
</template> 