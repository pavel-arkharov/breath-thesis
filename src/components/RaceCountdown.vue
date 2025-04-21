<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'

const store = useBreathingStore()
const props = defineProps<{
  countdown: number;
}>();

// Class for animation state
const animationClass = ref('');

// Sound reference
const countdownBeep = ref<HTMLAudioElement | null>(null);

// Color based on countdown number
const countdownColor = computed(() => {
  const isDarkMode = store.darkMode;
  
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
    countdownBeep.value.currentTime = 0;
    countdownBeep.value.play().catch(err => {
      // Ignore autoplay errors (common when user hasn't interacted with page)
      console.log('Audio play prevented:', err);
    });
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
  // Create audio element for beep sound
  countdownBeep.value = new Audio();
  countdownBeep.value.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAABQgJALNQQABzAAAA8DWZ0PnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tAwAAAE8kFX9TAABK6SGi5mBAA0EAXh9zSAEonD7mmTO+XPnBGIwyD/8uev//lz5c+fIBAyEMfLnz58IBh8Ph8Pj88EAMfD4fD4fj4fD4fD4fD4fD78uev5c+cEA//8ueEDAZc8PggZDLg+fOMieXPmQ5//5jLn/5c+cEA+Qy4IAZc+ZA35c///+XwfBAPh8Hg+QZc+cEA+D4Ph//wfD4flz5wQD4fD4P/////////+XPnBAPh8P//4Ph8EAMfB8Ph/lwQPh///LnDIc/LggZD//lz4QMhgIHDL//5c+XPnBAPlz1+XB88IAZc/8uccZDIQ5c//8uCBl//5c8IAP////y4IBgMhAYdkMUAMUAMUKBgw4QZDMphio3+6qACgBigBigYMAMUAMUDCGAwQoGDFAw9D0JkMxXl8mLT1jpx2Ox2O1C+bOJbHY7HY7EE4gUduO3Hbjtx2ILltx247cFOIFNOJ6cT04npxP/+xjGMY3///43GZOT/9PT09P/pxPTienHbiCcQTiBTTienEFOIJt9MzMzMzMzM//////////////////////////////////TifTiCq7jcZmZmZ6cT6cT6cT04gm304n04nalbTMzMzMzMz///////////////////////8bjMnJ9OJ9OJ9OJ9OJ6cQTb6cT6cQTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BTbgptwU24KbcFNuCm3BQ=';
  
  // Set animation class
  animationClass.value = 'animated';
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