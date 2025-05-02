<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Howl, Howler } from 'howler'

// State for player
const isPlaying = ref(false)
const isFading = ref(false)
const audioReady = ref(false)
const audioError = ref<string | null>(null)
const volume = ref(0.7) // Default volume

// Get the base URL for GitHub Pages deployment
// @ts-ignore - handle BASE_URL from Vite
const baseUrl = import.meta.env?.BASE_URL || '/'

// Properly join the base URL with the audio path
const audioPath = `${baseUrl}bg-music/ana.mp3`

// Create Howl instance with better options
const sound = ref<Howl | null>(null)

// Initialize audio
onMounted(() => {
  try {
    console.log('Initializing Howler audio player with path:', audioPath)
    console.log('Current hostname:', window.location.hostname)
    console.log('Is GitHub Pages?', window.location.hostname.includes('github.io'))
    console.log('Base URL:', baseUrl)
    
    // Create Howler instance with crossfading capabilities
    sound.value = new Howl({
      src: [audioPath],
      html5: true, // Better performance for streaming
      loop: true,
      volume: volume.value,
      preload: true,
      onload: () => {
        console.log('Audio loaded successfully, duration:', sound.value?.duration())
        audioReady.value = true
      },
      onloaderror: (id, error) => {
        console.error('Audio loading error:', error)
        audioError.value = "Couldn't load audio file"
      },
      onplayerror: (id, error) => {
        console.error('Audio playback error:', error)
        
        // Try to recover by restarting
        if (sound.value) {
          sound.value.once('unlock', () => {
            sound.value?.play()
          })
        }
      }
    })
  } catch (err) {
    console.error('Error initializing Howler audio player:', err)
    audioError.value = err instanceof Error ? err.message : String(err)
  }
})

// Clean up on component unmount
onBeforeUnmount(() => {
  if (sound.value) {
    sound.value.stop()
    sound.value.unload()
  }
})

// Toggle play/pause
function togglePlay() {
  if (!sound.value) return
  
  if (isPlaying.value) {
    pauseAudio()
  } else {
    playAudio()
  }
}

// Play the audio
function playAudio() {
  if (!sound.value) return
  
  if (!sound.value.playing()) {
    sound.value.fade(0, volume.value, 1000) // Smooth fade in
    sound.value.play()
    isPlaying.value = true
  }
}

// Pause the audio
function pauseAudio() {
  if (!sound.value) return
  
  if (sound.value.playing()) {
    sound.value.fade(volume.value, 0, 1000) // Smooth fade out
    
    // Stop playing after fade out
    setTimeout(() => {
      if (sound.value) {
        sound.value.pause()
      }
    }, 1000)
    
    isPlaying.value = false
  }
}

// Set volume (0-1)
function setVolume(newVolume: number) {
  if (!sound.value) return
  
  volume.value = Math.max(0, Math.min(1, newVolume))
  sound.value.volume(volume.value)
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