<script setup lang="ts">
import { useBreathingStore } from '@/stores/breathingStore'

const store = useBreathingStore()
</script>

<template>
  <div class="timer-preset-table">
    <div class="text-center mb-4 font-medium text-lg">
      Current Breathing Pattern
    </div>
    
    <div class="flex items-start gap-4">
      <!-- Main timer sets table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex-1">
        <div class="font-medium text-gray-600 dark:text-gray-300 mb-3">
          Timer Sets
        </div>
        
        <!-- Header for the breathing phases with color indicators -->
        <div class="flex items-center justify-between mt-1 mb-3 px-2 pl-10">
          <div class="flex-1 text-center">
            <div class="h-1.5 bg-green-500 dark:bg-green-600 rounded-full mx-auto w-10 mb-1"></div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">Inhale</div>
          </div>
          <div class="flex-1 text-center">
            <div class="h-1.5 bg-purple-500 dark:bg-purple-600 rounded-full mx-auto w-10 mb-1"></div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">Hold</div>
          </div>
          <div class="flex-1 text-center">
            <div class="h-1.5 bg-blue-500 dark:bg-blue-600 rounded-full mx-auto w-10 mb-1"></div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">Exhale</div>
          </div>
          <div class="flex-1 text-center">
            <div class="h-1.5 bg-red-500 dark:bg-red-600 rounded-full mx-auto w-10 mb-1"></div>
            <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">Hold</div>
          </div>
        </div>
        
        <table class="w-full">
          <tbody>
            <tr v-for="(timerSet, index) in store.currentExercise.timerSets" :key="timerSet.id" 
                class="border-b dark:border-gray-700 last:border-0">
              <td class="py-3 pl-2 w-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {{ index + 1 }}
              </td>
              <td class="py-3 px-2 font-mono">
                <div class="flex items-center justify-between text-center">
                  <div class="flex-1 font-semibold text-green-600 dark:text-green-500">
                    {{ timerSet.inhaleTime }}s
                  </div>
                  <div class="flex-none mx-1 text-gray-400">—</div>
                  <div class="flex-1 font-semibold text-purple-600 dark:text-purple-500">
                    {{ timerSet.holdAfterInhaleTime }}s
                  </div>
                  <div class="flex-none mx-1 text-gray-400">—</div>
                  <div class="flex-1 font-semibold text-blue-600 dark:text-blue-500">
                    {{ timerSet.exhaleTime }}s
                  </div>
                  <div class="flex-none mx-1 text-gray-400">—</div>
                  <div class="flex-1 font-semibold text-red-600 dark:text-red-500">
                    {{ timerSet.holdAfterExhaleTime }}s
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Rounds indicator to the right -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center self-stretch" style="min-width: 80px">
        <div class="text-gray-500 dark:text-gray-400 text-xs font-medium mb-2">ROUNDS</div>
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ store.currentExercise.rounds }}×
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-preset-table {
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
}
</style> 