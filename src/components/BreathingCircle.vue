<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { BreathPhase } from '@/types'
import RaceCountdown from './RaceCountdown.vue'
import TimerPresetTable from './TimerPresetTable.vue'

const store = useBreathingStore()

// Progress of the current phase (0-100%)
const progress = ref(0)

// Fade effect for transition
const fadeClass = ref('')

// Determine if we should show the racing countdown animation
const showRaceCountdown = computed(() => {
  return store.session.isRunning && 
         store.session.currentPhase === BreathPhase.PREPARE;
})

// Determine if we're in standby (not running and not completed)
const isStandby = computed(() => {
  return !store.session.isRunning && 
         store.session.currentPhase !== BreathPhase.COMPLETED;
})

// Map breath phase to color CSS variable
const phaseColor = computed(() => {
  switch (store.session.currentPhase) {
    case BreathPhase.INHALE:
      return 'var(--inhale-color)'
    case BreathPhase.HOLD_AFTER_INHALE:
      return 'var(--hold-in-color)'
    case BreathPhase.EXHALE:
      return 'var(--exhale-color)'
    case BreathPhase.HOLD_AFTER_EXHALE:
      return 'var(--hold-out-color)'
    default:
      return 'var(--transition-color)'
  }
})

// Phase name to display
const phaseName = computed(() => {
  switch (store.session.currentPhase) {
    case BreathPhase.PREPARE:
      return 'PREPARE'
    case BreathPhase.INHALE:
      return 'INHALE'
    case BreathPhase.HOLD_AFTER_INHALE:
      return 'HOLD'
    case BreathPhase.EXHALE:
      return 'EXHALE'
    case BreathPhase.HOLD_AFTER_EXHALE:
      return 'HOLD'
    case BreathPhase.COMPLETED:
      return 'COMPLETED'
    default:
      return ''
  }
})

// Rounds info
const roundsInfo = computed(() => {
  return `Round ${store.session.currentRound} of ${store.session.totalRounds}`
})

// Calculate progress percentage based on time remaining and total phase time
function updateProgress() {
  if (!store.session.isRunning || store.session.currentPhase === BreathPhase.COMPLETED) {
    progress.value = 0
    return
  }
  
  // Get the total time for the current phase
  const totalPhaseTime = store.currentPhaseTime
  
  // Special case: if we're waiting at zero, show 100% progress
  if (store.isWaitingAtZero) {
    progress.value = 100
    return
  }
  
  // Calculate progress (1 - timeRemaining/totalTime) as percentage
  progress.value = (1 - store.session.timeRemaining / totalPhaseTime) * 100
}

// Watch for changes in the timer to update the progress
watch(
  () => [store.session.timeRemaining, store.isWaitingAtZero],
  updateProgress,
  { immediate: true }
)

// Watch for phase changes to reset progress
watch(
  () => store.session.currentPhase,
  (newPhase, oldPhase) => {
    // If transitioning from PREPARE to another phase, apply fade-in effect
    if (oldPhase === BreathPhase.PREPARE && newPhase !== BreathPhase.PREPARE) {
      // Start with invisible
      fadeClass.value = 'opacity-0';
      
      // Trigger fade-in after a short delay
      setTimeout(() => {
        fadeClass.value = 'fade-in';
      }, 100);
    } else {
      // Reset fade class for other transitions
      fadeClass.value = '';
    }
    
    if (!store.isWaitingAtZero) {
      progress.value = 0
    }
  }
)

// Watch for waiting at zero to handle the transition appearance
watch(
  () => store.isWaitingAtZero,
  (isWaiting, wasWaiting) => {
    // If we're just starting to wait at zero in the PREPARE phase,
    // prepare for the transition
    if (isWaiting && !wasWaiting && store.session.currentPhase === BreathPhase.PREPARE) {
      fadeClass.value = 'opacity-0';
    }
  }
)
</script>

<template>
  <div class="relative">
    <!-- Timer Preset Table in standby mode -->
    <div v-if="isStandby">
      <TimerPresetTable />
    </div>
    
    <!-- Active session UI -->
    <div v-else>
      <!-- Rounds indicator -->
      <div 
        v-if="store.session.isRunning && store.session.currentPhase !== BreathPhase.COMPLETED" 
        class="text-center mb-4 font-medium"
      >
        {{ roundsInfo }}
      </div>
      
      <!-- Race Countdown for PREPARE phase -->
      <div v-if="showRaceCountdown && !store.isWaitingAtZero" class="breathing-circle-container">
        <RaceCountdown :countdown="store.session.timeRemaining" />
      </div>
      
      <!-- Regular circle for other phases -->
      <div v-else class="breathing-circle-container" :class="fadeClass">
        <!-- Progress circle -->
        <svg class="breathing-circle" viewBox="0 0 100 100">
          <!-- Background circle -->
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            stroke-width="2"
            class="text-gray-200 dark:text-gray-700"
          />
          
          <!-- Progress arc -->
          <circle
            v-if="store.session.isRunning && store.session.currentPhase !== BreathPhase.COMPLETED"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            :stroke="phaseColor"
            stroke-width="4"
            stroke-linecap="round"
            class="progress-arc"
            :style="{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
            }"
            transform="rotate(-90, 50, 50)"
          />
          
          <!-- Timer display in center -->
          <text
            x="50"
            y="50"
            text-anchor="middle"
            dominant-baseline="middle"
            class="timer-text"
            :class="{ 
              'text-4xl': true, 
              'text-5xl': store.session.timeRemaining <= 3 && store.session.currentPhase === BreathPhase.PREPARE 
            }"
          >
            {{ store.formatTime(store.session.timeRemaining) }}
          </text>
        </svg>
      </div>
      
      <!-- Phase name display -->
      <div class="text-center mt-4 text-xl font-semibold" :style="{ color: phaseColor }">
        {{ phaseName }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.breathing-circle-container {
  width: 16rem;
  height: 16rem;
  position: relative;
  margin: 0 auto;
}

.breathing-circle {
  width: 100%;
  height: 100%;
}

.progress-arc {
  transition: stroke-dashoffset 0.1s linear;
}

.timer-text {
  font-size: 1.5rem;
  font-weight: bold;
  fill: currentColor;
  transition: font-size 0.2s ease;
}

.opacity-0 {
  opacity: 0;
}

.fade-in {
  animation: fadeInAnimation 1.5s ease forwards;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style> 