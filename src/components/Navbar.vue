<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBreathingStore } from '@/stores/breathingStore'
import AudioPlayer from './AudioPlayer.vue'
import SpeechSynthesis from './SpeechSynthesis.vue'

const router = useRouter()
const store = useBreathingStore()

// Emit toggle settings event
const emit = defineEmits(['toggle-settings'])

// Navigate to settings page - replaced with toggle action
function toggleSettings() {
  emit('toggle-settings')
}

// Toggle dark mode
function toggleDarkMode() {
  console.log('Navbar: toggleDarkMode clicked, current state:', store.isDarkMode)
  store.toggleDarkMode()
  console.log('Navbar: after toggle, new state:', store.isDarkMode)
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-slate-200 dark:bg-slate-800 shadow-md py-2 px-4 z-50">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo/Title -->
      <div class="text-xl font-bold text-gray-900 dark:text-white">
        Breathing Trainer
      </div>
      
      <!-- Controls -->
      <div class="flex items-center space-x-4">
        <!-- Dark/Light mode toggle -->
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
          :title="store.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon (light mode) -->
          <svg v-if="store.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          
          <!-- Moon icon (dark mode) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <!-- Speech Synthesis toggle -->
        <SpeechSynthesis />
        
        <!-- Audio Player -->
        <AudioPlayer />
        
        <!-- Settings button -->
        <button 
          @click="toggleSettings" 
          class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 dark:text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template> 