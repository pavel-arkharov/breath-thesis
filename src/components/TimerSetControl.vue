<script setup lang="ts">
import { computed } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { TimerSet } from '@/types'

const props = defineProps<{
  timerSet: TimerSet;
  index: number;
  canDelete: boolean;
}>()

const store = useBreathingStore()

// Formatted name for the timer set
const timerSetName = computed(() => {
  return `Timer Set ${props.index + 1}`
})

// Update timer values
function updateInhaleTime(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(value) && value > 0) {
    store.updateTimerSet(props.timerSet.id, { inhaleTime: value })
  }
}

function updateHoldAfterInhaleTime(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(value) && value >= 0) {
    store.updateTimerSet(props.timerSet.id, { holdAfterInhaleTime: value })
  }
}

function updateExhaleTime(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(value) && value > 0) {
    store.updateTimerSet(props.timerSet.id, { exhaleTime: value })
  }
}

function updateHoldAfterExhaleTime(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(value) && value >= 0) {
    store.updateTimerSet(props.timerSet.id, { holdAfterExhaleTime: value })
  }
}

function deleteTimerSet() {
  store.removeTimerSet(props.timerSet.id)
}
</script>

<template>
  <div class="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-medium">{{ timerSetName }}</h3>
      
      <button 
        v-if="canDelete" 
        @click="deleteTimerSet" 
        class="text-red-500 hover:text-red-700"
        aria-label="Delete timer set"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Inhale (seconds)
        </label>
        <input 
          type="number" 
          min="1" 
          max="20" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          :value="timerSet.inhaleTime"
          @change="updateInhaleTime"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hold (seconds)
        </label>
        <input 
          type="number" 
          min="0" 
          max="20" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          :value="timerSet.holdAfterInhaleTime"
          @change="updateHoldAfterInhaleTime"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Exhale (seconds)
        </label>
        <input 
          type="number" 
          min="1" 
          max="20" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          :value="timerSet.exhaleTime"
          @change="updateExhaleTime"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hold after exhale (seconds)
        </label>
        <input 
          type="number" 
          min="0" 
          max="20" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          :value="timerSet.holdAfterExhaleTime"
          @change="updateHoldAfterExhaleTime"
        >
      </div>
    </div>
  </div>
</template> 