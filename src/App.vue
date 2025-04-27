<script setup lang="ts">
// Initialize app
import { onMounted } from 'vue'
import AudioPlayer from './components/AudioPlayer.vue'

// Debug function to test dark mode directly
onMounted(() => {
  console.log('App mounted, testing direct dark mode manipulation');
  // Try forcing dark mode directly on the document element
  document.documentElement.classList.add('dark');
  console.log('Added dark class to html element, classes:', document.documentElement.className);
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Audio player component -->
    <AudioPlayer />
    
    <router-view></router-view>
  </div>
</template>
