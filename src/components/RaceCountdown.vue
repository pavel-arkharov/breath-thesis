<script setup lang="ts">
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { Howl } from 'howler'

const store = useBreathingStore()
const props = defineProps<{
  countdown: number;
}>();

// Class for animation state
const animationClass = ref('');

// Sound reference
const countdownBeep = ref<Howl | null>(null);

// Color based on countdown number
const countdownColor = computed(() => {
  const isDarkMode = store.isDarkMode;
  
  switch(props.countdown) {
    case 3: return isDarkMode ? 'text-yellow-400' : 'text-yellow-500';
    case 2: return isDarkMode ? 'text-orange-400' : 'text-orange-500';
    case 1: return isDarkMode ? 'text-red-400' : 'text-red-500';
    default: return isDarkMode ? 'text-blue-400' : 'text-blue-500';
  }
});

// Play beep sound for the countdown
function playBeep() {
  if (countdownBeep.value) {
    countdownBeep.value.play();
  } else {
    // Fallback to native Audio API if Howler failed
    try {
      const audio = new Audio('./sounds/beep.wav');
      audio.volume = 0.7;
      audio.play().catch(err => console.warn('Native audio playback failed:', err));
    } catch (e) {
      console.warn('Could not play fallback audio:', e);
    }
  }
}

// Update animation when countdown changes
watch(
  () => props.countdown,
  (newValue, oldValue) => {
    // Reset the animation class
    animationClass.value = '';
    
    // Play beep sound
    playBeep();
    
    // Trigger a reflow to ensure the animation restarts
    setTimeout(() => {
      animationClass.value = 'animated';
    }, 10);
  },
  { immediate: true }
);

// Set up after component is mounted
onMounted(() => {
  // Create Howl instance for beep sound
  countdownBeep.value = new Howl({
    src: ['./sounds/beep.wav'],
    format: ['wav'],
    volume: 0.7,
    preload: true,
    html5: false,
    onloaderror: (id, error) => {
      console.error('Beep sound failed to load:', error);
      // Create a fallback audio method using native Audio API
      // Instead of replacing Howl with a custom object, we'll use native Audio directly
      countdownBeep.value = null;
      
      // We'll use this fallback in the playBeep function
    }
  });
  
  // Set animation class
  animationClass.value = 'animated';
});

// Clean up when component is destroyed
onBeforeUnmount(() => {
  if (countdownBeep.value) {
    countdownBeep.value.unload();
  }
});
</script>

<template>
  <div class="countdown-container">
    <div class="countdown-number" :class="[animationClass, countdownColor]">
      {{ countdown }}
    </div>
    <div class="countdown-pulse" :class="animationClass"></div>
    <div class="countdown-text">GET READY</div>
  </div>
</template>

<style scoped>
.countdown-container {
  position: relative;
  width: 16rem;
  height: 16rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(17,24,39,0.8) 0%, rgba(17,24,39,0.5) 70%, rgba(17,24,39,0) 100%);
}

.countdown-number {
  font-size: 10rem;
  font-weight: 800;
  line-height: 1;
  opacity: 0;
  transform: scale(0.2);
  position: relative;
  z-index: 10;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.countdown-text {
  position: absolute;
  bottom: 2rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transform: translateY(20px);
  animation: textAppear 0.5s ease-out forwards;
  animation-delay: 0.3s;
}

.countdown-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
}

.countdown-number.animated {
  animation: countdownAnim 1s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.countdown-pulse.animated {
  animation: pulseAnim 1s ease-in-out;
}

@keyframes countdownAnim {
  0% {
    opacity: 0;
    transform: scale(0.2) translateY(50px);
  }
  20% {
    opacity: 1;
    transform: scale(1.2);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(3) translateY(-20px);
  }
}

@keyframes pulseAnim {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@keyframes textAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode compatibility */
:global(.dark) .countdown-container {
  background: radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%);
}
</style> 