<script setup lang="ts">
import { ref } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { TimerFormat } from '@/types'
import TimerSetControl from './TimerSetControl.vue'
import SpeechSynthesis from './SpeechSynthesis.vue'

const store = useBreathingStore()

// Reference to the SpeechSynthesis component
const speechSynthesis = ref<InstanceType<typeof SpeechSynthesis> | null>(null)

// Props
const props = defineProps<{
  isVisible: boolean
}>()

// Emits
const emit = defineEmits(['close', 'save'])

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
  store.toggleDarkMode()
}

// Toggle timer format
function toggleTimerFormat() {
  store.toggleTimerFormat()
}

// Save settings and close panel
function saveSettings() {
  store.saveExercise()
  emit('save')
  emit('close')
}

// Close the panel without saving
function closePanel() {
  emit('close')
}
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
    :class="isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click="closePanel"
  ></div>
  
  <div 
    class="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-gray-300 dark:bg-dark-50 z-50 shadow-lg transform transition-transform duration-300 overflow-auto"
    :class="isVisible ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-black dark:text-white">Settings</h2>
        <button 
          @click="closePanel"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neon-pink/20 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-neon-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Breathing Exercise Settings -->
      <div class="bg-gray-300 dark:bg-dark-50 rounded-lg shadow-md p-4 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-black dark:text-white">Breathing Exercise</h3>
        
        <!-- Render timer sets -->
        <TimerSetControl
          v-for="(timerSet, index) in store.currentExercise.timerSets"
          :key="timerSet.id"
          :timer-set="timerSet"
          :index="index"
          :can-delete="store.currentExercise.timerSets.length > 1"
        />
        
        <div class="flex justify-between mt-4 mb-4">
          <button 
            @click="addTimerSet" 
            class="px-4 py-2 bg-green-500 dark:bg-black dark:text-neon-green dark:border dark:border-neon-green text-white rounded-md hover:bg-green-600 dark:hover:bg-neon-green/20 transition dark:shadow-neon-green/30"
          >
            Add Timer Set
          </button>
          
          <div>
            <label class="block text-sm font-bold text-black dark:text-white mb-1">
              Rounds
            </label>
            <input 
              type="number" 
              min="1" 
              max="50" 
              class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-100 text-gray-900 dark:text-white"
              :value="store.currentExercise.rounds"
              @change="updateRounds"
            >
          </div>
        </div>
      </div>
      
      <!-- App Settings -->
      <div class="bg-gray-300 dark:bg-dark-50 rounded-lg shadow-md p-4 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-black dark:text-white">App Settings</h3>
        
        <!-- Dark mode toggle -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-black dark:text-white font-bold">Dark Mode</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              :checked="store.isDarkMode" 
              @change="toggleDarkMode" 
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-neon-blue/30 rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-neon-blue"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
              <svg v-if="store.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
            </span>
          </label>
        </div>
        
        <!-- Timer format toggle -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-black dark:text-white font-bold">Timer Format</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              :checked="store.timerFormat === TimerFormat.TIME" 
              @change="toggleTimerFormat" 
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-neon-green/30 rounded-full peer dark:bg-dark-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-neon-green"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-white">
              {{ store.timerFormat === TimerFormat.SIMPLE ? 'Simple (3, 2, 1)' : 'Time (00:03)' }}
            </span>
          </label>
        </div>
        
        <!-- Voice Guidance section -->
        <h4 class="text-md font-bold mb-2 mt-6 text-gray-900 dark:text-white">Voice Guidance</h4>
        
        <!-- Speech synthesis component (hidden) -->
        <SpeechSynthesis ref="speechSynthesis" class="hidden" />
        
        <!-- Voice Selection - will be shown if voices are available -->
        <div v-if="speechSynthesis && speechSynthesis.voices && speechSynthesis.voices.length > 0" class="mb-4">
          <label class="block text-sm font-bold text-black dark:text-white mb-1">
            Voice
          </label>
          <select 
            class="w-full p-2 border border-gray-500 dark:border-gray-600 rounded-md bg-white dark:bg-dark-100 text-gray-900 dark:text-white"
            @change="speechSynthesis.changeVoice($event)"
          >
            <option v-for="(voice, index) in speechSynthesis.voices" :key="index" :value="index">
              {{ voice.name }} ({{ voice.lang }})
            </option>
          </select>
        </div>
        
        <!-- Speech Rate -->
        <div class="mb-4">
          <label class="block text-sm font-bold text-black dark:text-white mb-1">
            Speech Rate
          </label>
          <div class="flex items-center">
            <span class="mr-2 text-sm font-medium text-black dark:text-gray-200">Slow</span>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.1" 
              class="flex-1 h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer dark:bg-dark-100"
              @change="speechSynthesis && speechSynthesis.adjustRate($event)"
              value="0.9"
            >
            <span class="ml-2 text-sm font-medium text-black dark:text-gray-200">Fast</span>
          </div>
        </div>
        
        <!-- Volume -->
        <div class="mb-2">
          <label class="block text-sm font-bold text-black dark:text-white mb-1">
            Volume
          </label>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black dark:text-gray-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              class="flex-1 h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer dark:bg-dark-100"
              @change="speechSynthesis && speechSynthesis.adjustVolume($event)"
              value="1"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black dark:text-gray-200 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
        </div>
        
        <!-- Test Voice button -->
        <button 
          @click="speechSynthesis && speechSynthesis.speak('This is a test of the voice guidance system')"
          class="mt-2 px-4 py-2 bg-blue-500 dark:bg-black dark:text-neon-green dark:border dark:border-neon-green text-white rounded-md hover:bg-blue-600 dark:hover:bg-neon-green/20 transition text-sm"
        >
          Test Voice
        </button>
      </div>
      
      <!-- Save button -->
      <button 
        @click="saveSettings" 
        class="w-full px-4 py-3 bg-blue-500 dark:bg-black dark:text-neon-blue dark:border dark:border-neon-blue text-white text-lg rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-neon-blue/20 transition dark:shadow-neon-blue/30"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style> 