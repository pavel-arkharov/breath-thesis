<script setup lang="ts">
import { ref } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { v4 as uuidv4 } from 'uuid'

// Define preset pattern type
interface BreathingPattern {
  name: string;
  description: string;
  patterns: number[][];
  rounds: number;
}

const store = useBreathingStore()

// Track expanded/collapsed state - default to collapsed
const isExpanded = ref(false)

// Toggle expanded/collapsed state
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

// Function to load and apply the preset
function applyPreset(preset: BreathingPattern): void {
  // Clear any existing timer sets
  store.currentExercise.timerSets = []
  
  // Add each pattern from the preset
  preset.patterns.forEach((pattern: number[]) => {
    store.currentExercise.timerSets.push({
      id: uuidv4(),
      inhaleTime: pattern[0],
      holdAfterInhaleTime: pattern[1],
      exhaleTime: pattern[2],
      holdAfterExhaleTime: pattern[3]
    })
  })
  
  // Set the number of rounds
  store.updateRounds(preset.rounds)
  
  // Save the changes
  store.saveExercise()
  
  // Optional: start the exercise immediately
  // store.startSession()
}

// The preset for the 8-8-8-8, 8-10-10-10, etc. pattern
const progressiveHoldPreset: BreathingPattern = {
  name: "Progressive Hold",
  description: "Increases hold time progressively",
  patterns: [
    [8, 8, 8, 8],
    [8, 10, 10, 10],
    [8, 12, 12, 12],
    [8, 20, 20, 20]
  ],
  rounds: 2
}

// The gradual increase preset (4-4-4-4, 4-6-4-6, etc.)
const gradualIncreasePreset: BreathingPattern = {
  name: "Gradual Increase",
  description: "Gradually increases all breath phases",
  patterns: [
    [4, 4, 4, 4],
    [4, 6, 4, 6],
    [6, 8, 6, 8],
    [8, 8, 8, 8]
  ],
  rounds: 3
}
</script>

<template>
  <div class="breathing-presets">
    <div class="presets-header flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Presets</h3>
      <button 
        @click="toggleExpanded" 
        class="fold-button p-1 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
        :title="isExpanded ? 'Collapse presets' : 'Expand presets'"
      >
        <!-- Chevron icon that rotates based on expanded state -->
        <svg xmlns="http://www.w3.org/2000/svg" 
             class="h-5 w-5 transform transition-transform duration-300" 
             :class="{'rotate-180': !isExpanded}"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    
    <!-- Foldable content with transition -->
    <div 
      class="presets-content overflow-hidden transition-all duration-300" 
      :style="{
        maxHeight: isExpanded ? '1000px' : '0px',
        opacity: isExpanded ? 1 : 0,
        marginTop: isExpanded ? '0.5rem' : '0'
      }"
    >
      <div class="presets-grid">
        <!-- Progressive Hold Preset -->
        <button 
          @click="applyPreset(progressiveHoldPreset)"
          class="preset-button bg-white dark:bg-slate-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-slate-600"
        >
          <div class="preset-name font-medium text-gray-900 dark:text-white mb-1">{{ progressiveHoldPreset.name }}</div>
          <div class="preset-desc text-sm text-gray-500 dark:text-gray-400 mb-2">{{ progressiveHoldPreset.description }}</div>
          
          <div class="preset-pattern grid grid-cols-4 gap-1 mb-1">
            <div class="text-xs font-medium text-center text-blue-700 dark:text-blue-400">In</div>
            <div class="text-xs font-medium text-center text-purple-700 dark:text-purple-400">Hold</div>
            <div class="text-xs font-medium text-center text-green-700 dark:text-green-400">Out</div>
            <div class="text-xs font-medium text-center text-red-700 dark:text-red-400">Hold</div>
          </div>
          
          <div v-for="(pattern, index) in progressiveHoldPreset.patterns" :key="index" class="preset-pattern grid grid-cols-4 gap-1 text-sm">
            <div class="bg-blue-100 dark:bg-blue-900/30 rounded text-center py-1">{{ pattern[0] }}</div>
            <div class="bg-purple-100 dark:bg-purple-900/30 rounded text-center py-1">{{ pattern[1] }}</div>
            <div class="bg-green-100 dark:bg-green-900/30 rounded text-center py-1">{{ pattern[2] }}</div>
            <div class="bg-red-100 dark:bg-red-900/30 rounded text-center py-1">{{ pattern[3] }}</div>
          </div>
          
          <div class="preset-rounds text-xs text-center mt-2 font-medium text-gray-700 dark:text-gray-300">
            {{ progressiveHoldPreset.rounds }} rounds
          </div>
        </button>
        
        <!-- Gradual Increase Preset -->
        <button 
          @click="applyPreset(gradualIncreasePreset)"
          class="preset-button bg-white dark:bg-slate-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-slate-600"
        >
          <div class="preset-name font-medium text-gray-900 dark:text-white mb-1">{{ gradualIncreasePreset.name }}</div>
          <div class="preset-desc text-sm text-gray-500 dark:text-gray-400 mb-2">{{ gradualIncreasePreset.description }}</div>
          
          <div class="preset-pattern grid grid-cols-4 gap-1 mb-1">
            <div class="text-xs font-medium text-center text-blue-700 dark:text-blue-400">In</div>
            <div class="text-xs font-medium text-center text-purple-700 dark:text-purple-400">Hold</div>
            <div class="text-xs font-medium text-center text-green-700 dark:text-green-400">Out</div>
            <div class="text-xs font-medium text-center text-red-700 dark:text-red-400">Hold</div>
          </div>
          
          <div v-for="(pattern, index) in gradualIncreasePreset.patterns" :key="index" class="preset-pattern grid grid-cols-4 gap-1 text-sm">
            <div class="bg-blue-100 dark:bg-blue-900/30 rounded text-center py-1">{{ pattern[0] }}</div>
            <div class="bg-purple-100 dark:bg-purple-900/30 rounded text-center py-1">{{ pattern[1] }}</div>
            <div class="bg-green-100 dark:bg-green-900/30 rounded text-center py-1">{{ pattern[2] }}</div>
            <div class="bg-red-100 dark:bg-red-900/30 rounded text-center py-1">{{ pattern[3] }}</div>
          </div>
          
          <div class="preset-rounds text-xs text-center mt-2 font-medium text-gray-700 dark:text-gray-300">
            {{ gradualIncreasePreset.rounds }} rounds
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.breathing-presets {
  width: 100%;
}

.presets-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

.preset-button {
  text-align: left;
  transition: all 0.2s;
}

.preset-button:hover {
  transform: translateY(-2px);
}

/* Animation for folding/unfolding */
.presets-content {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out;
}

/* Responsive styles - add two columns on larger screens */
@media (min-width: 768px) {
  .presets-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .presets-grid {
    grid-template-columns: 1fr;
  }
}
</style> 