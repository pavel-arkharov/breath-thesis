<script setup lang="ts">
// AboutModal.vue - Modal component to display app information

defineProps<{
  isVisible: boolean;
}>();

defineEmits(['close']);
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 flex items-center justify-center"
    :class="isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    @click="$emit('close')"
  >
    <div 
      class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-hidden transition-transform duration-300"
      :class="isVisible ? 'scale-100' : 'scale-95'"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-300 dark:border-gray-700">
        <h2 class="text-xl font-bold text-black dark:text-white">About Breathing Trainer</h2>
        <button 
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-900 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Body content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[70vh]">
        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-black dark:text-white">The App</h3>
          <p class="text-gray-900 dark:text-gray-300 mb-3">
            Breathing Trainer is a customizable app designed to help you practice breathing techniques.
            It provides a visual and audio-guided experience to improve relaxation, focus, and overall well-being.
          </p>
          <p class="text-gray-900 dark:text-gray-300">
            The app allows you to create custom breathing patterns by adjusting the duration of inhale, hold, 
            exhale, and post-exhale hold phases, helping you find the perfect rhythm for your needs.
          </p>
        </section>
        
        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-black dark:text-white">Features</h3>
          <ul class="list-disc pl-5 text-gray-900 dark:text-gray-300 space-y-2">
            <li>Customizable breathing patterns</li>
            <li>Visual breathing guidance</li>
            <li>Voice prompts</li>
            <li>Ambient background music</li>
            <li>Dark mode support</li>
            <li>Progress tracking</li>
          </ul>
        </section>
        
        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-black dark:text-white">Author</h3>
          <p class="text-gray-900 dark:text-gray-300">
            Developed by Pavel Arkharov
          </p>
        </section>
        
        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2 text-black dark:text-white">Music Credits</h3>
          <p class="text-gray-900 dark:text-gray-300">
            Special thanks to <span class="font-semibold">Moby</span> for providing the ambient music used in this application. 
            All background music tracks are available under Moby's free-to-use license for independent creators, 
            non-profits, and projects like this one.
          </p>
          <p class="mt-2 text-gray-900 dark:text-gray-300">
            Visit <a href="https://mobygratis.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">mobygratis.com</a> 
            to explore more of Moby's freely available music.
          </p>
        </section>
        
        <section>
          <h3 class="text-lg font-semibold mb-2 text-black dark:text-white">Open Source</h3>
          <p class="text-gray-900 dark:text-gray-300">
            This project is open source and built with Vue.js, TypeScript, Tailwind CSS, and Howler.js.
            The source code is available on <a href="https://github.com/parkharo/breath-thesis" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>.
          </p>
        </section>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700">
        <p class="text-center text-gray-900 dark:text-gray-300">
          &copy; 2025 Breathing Trainer | <span class="text-gray-700 dark:text-gray-400">Version 1.0</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style> 