<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBreathingStore } from '@/stores/breathingStore'
import { TimerFormat } from '@/types'
import TimerSetControl from '@/components/TimerSetControl.vue'

const store = useBreathingStore()
const router = useRouter()

// Update the number of rounds
function updateRounds(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(value) && value > 0) {
    store.updateRounds(value)
  }
}

// Add a new timer set
function addTimerSet() {
  store.addTimerSet()
}

// Toggle dark mode
function toggleDarkMode() {
  console.log('Settings.vue toggleDarkMode called')
  store.toggleDarkMode()
  console.log('After calling store.toggleDarkMode, isDarkMode =', store.isDarkMode)
}

// Toggle timer format
function toggleTimerFormat() {
  store.toggleTimerFormat()
}

// Navigate back to home page
function goToHome() {
  router.push('/')
}

// Save settings and go back to the home page
function saveSettings() {
  store.saveExercise()
  goToHome()
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Breathing Settings</h1>
    
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Configure Breathing Exercise</h2>
      
      <!-- Render timer sets -->
      <TimerSetControl
        v-for="(timerSet, index) in store.currentExercise.timerSets"
        :key="timerSet.id"
        :timer-set="timerSet"
        :index="index"
        :can-delete="store.currentExercise.timerSets.length > 1"
      />
      
      <div class="flex justify-between mb-6">
        <button 
          @click="addTimerSet" 
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Add Timer Set
        </button>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rounds
          </label>
          <input 
            type="number" 
            min="1" 
            max="50" 
            class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            :value="store.currentExercise.rounds"
            @change="updateRounds"
          >
        </div>
      </div>
      
      <div class="flex justify-between">
        <button 
          @click="goToHome" 
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Back
        </button>
        <button 
          @click="saveSettings" 
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
    
    <!-- App preferences -->
    <div class="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">App Settings</h2>
      
      <!-- Dark mode toggle -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            :checked="store.isDarkMode" 
            @change="toggleDarkMode" 
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            <svg v-if="store.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
          </span>
        </label>
      </div>
      
      <!-- Timer format toggle -->
      <div class="flex justify-between items-center">
        <span class="text-gray-700 dark:text-gray-300">Timer Format</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            :checked="store.timerFormat === TimerFormat.TIME" 
            @change="toggleTimerFormat" 
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ store.timerFormat === TimerFormat.SIMPLE ? 'Simple (3, 2, 1)' : 'Time (00:03)' }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template> 