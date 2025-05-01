<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State for player
const isPlaying = ref(false)
const currentAudio = ref<HTMLAudioElement | null>(null)
const nextAudio = ref<HTMLAudioElement | null>(null)
const isFading = ref(false)
const crossfadeDuration = 10 // seconds
const audioReady = ref(false)
const audioError = ref<string | null>(null)

// Get the base URL for GitHub Pages deployment
// @ts-ignore - handle BASE_URL from Vite
const baseUrl = import.meta.env?.BASE_URL || '/'

// Properly join the base URL with the audio path
const audioPath = `${baseUrl}bg-music/ana.mp3`

// Initialize audio objects
onMounted(() => {
  try {
    console.log('Initializing audio player with path:', audioPath)
    console.log('Current hostname:', window.location.hostname)
    console.log('Is GitHub Pages?', window.location.hostname.includes('github.io'))
    console.log('Base URL:', baseUrl)
    
    // Create first audio element
    currentAudio.value = new Audio(audioPath)
    currentAudio.value.volume = 1
    currentAudio.value.loop = false // We'll handle looping manually for crossfade

    // Create second audio element for crossfade
    nextAudio.value = new Audio(audioPath)
    nextAudio.value.volume = 0
    nextAudio.value.loop = false

    // Add timeupdate listener to handle crossfade
    currentAudio.value.addEventListener('timeupdate', handleTimeUpdate)
    
    // Add error handling
    currentAudio.value.addEventListener('error', (e) => {
      console.error('Audio error:', e)
      audioError.value = "Couldn't load audio file"
    })
    
    // Log when metadata is loaded to confirm file is valid
    currentAudio.value.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded, duration:', currentAudio.value?.duration)
      audioReady.value = true
    })
  } catch (err) {
    console.error('Error initializing audio player:', err)
    audioError.value = err instanceof Error ? err.message : String(err)
  }
})

// Clean up event listeners
onBeforeUnmount(() => {
  if (currentAudio.value) {
    currentAudio.value.removeEventListener('timeupdate', handleTimeUpdate)
    currentAudio.value.pause()
  }
  if (nextAudio.value) {
    nextAudio.value.pause()
  }
})

// Handle time update to implement crossfade
function handleTimeUpdate() {
  if (!currentAudio.value || !nextAudio.value) return

  const duration = currentAudio.value.duration
  const currentTime = currentAudio.value.currentTime
  
  // Start crossfade when we're 10 seconds from the end
  if (duration - currentTime <= crossfadeDuration && !isFading.value) {
    startCrossfade()
  }
}

// Start crossfade between current and next audio
function startCrossfade() {
  if (!currentAudio.value || !nextAudio.value) return
  
  isFading.value = true
  
  // Start the next audio
  nextAudio.value.currentTime = 0
  nextAudio.value.play()
  
  // Create crossfade effect
  const fadeInterval = setInterval(() => {
    if (!currentAudio.value || !nextAudio.value) {
      clearInterval(fadeInterval)
      return
    }
    
    // Decrease current audio volume
    if (currentAudio.value.volume > 0.05) {
      currentAudio.value.volume -= 0.05
    } else {
      currentAudio.value.volume = 0
    }
    
    // Increase next audio volume
    if (nextAudio.value.volume < 0.95) {
      nextAudio.value.volume += 0.05
    } else {
      nextAudio.value.volume = 1
    }
    
    // If crossfade is complete, swap audio elements
    if (currentAudio.value.volume === 0 && nextAudio.value.volume === 1) {
      clearInterval(fadeInterval)
      swapAudio()
    }
  }, crossfadeDuration * 1000 / 20) // 20 steps for the crossfade
}

// Swap current and next audio elements
function swapAudio() {
  if (!currentAudio.value || !nextAudio.value) return
  
  // Pause the old current audio
  currentAudio.value.pause()
  currentAudio.value.currentTime = 0
  
  // Swap the references
  const temp = currentAudio.value
  currentAudio.value = nextAudio.value
  nextAudio.value = temp
  
  // Reset volumes
  currentAudio.value.volume = 1
  nextAudio.value.volume = 0
  
  // Reset fading flag
  isFading.value = false
}

// Toggle play/pause
function togglePlay() {
  if (isPlaying.value) {
    pauseAudio()
  } else {
    playAudio()
  }
  isPlaying.value = !isPlaying.value
}

// Play the audio
function playAudio() {
  if (currentAudio.value) {
    currentAudio.value.play()
  }
}

// Pause the audio
function pauseAudio() {
  if (currentAudio.value) {
    currentAudio.value.pause()
  }
  if (nextAudio.value) {
    nextAudio.value.pause()
  }
  isFading.value = false
}
</script>

<template>
  <div class="audio-player">
    <button 
      @click="togglePlay" 
      class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
      :title="isPlaying ? 'Pause music' : 'Play music'"
      :disabled="!audioReady || audioError !== null"
    >
      <!-- Loading spinner -->
      <svg v-if="!audioReady && !audioError" class="animate-spin h-6 w-6 text-blue-500 dark:text-neon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Error icon -->
      <svg v-else-if="audioError" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 dark:text-neon-pink" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      
      <!-- Play icon when paused -->
      <svg v-else-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 dark:text-neon-green" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
      </svg>
      
      <!-- Pause icon when playing -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 dark:text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <!-- Error tooltip -->
    <div v-if="audioError" class="error-tooltip">
      {{ audioError }}
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  position: relative;
}

.error-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 0, 153, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 0 8px rgba(255, 0, 153, 0.7);
}
</style> 