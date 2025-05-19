<script setup lang="ts">
// Initialize app
import { onMounted, watch, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import DebugMenu from './components/DebugMenu.vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { useUserStore } from '@/stores/userStore'

const breathingStore = useBreathingStore()
const userStore = useUserStore()
const isSettingsPanelVisible = ref(false)

console.log('App.vue initial isDarkMode state:', userStore.userSettings.darkMode)

// Apply dark mode based on store settings
onMounted(() => {
  console.log('App.vue onMounted - isDarkMode:', userStore.userSettings.darkMode)
  
  // Initialize auth
  userStore.initAuth()
})

// Watch for changes to dark mode
watch(() => userStore.userSettings.darkMode, (newValue) => {
  console.log('App.vue - isDarkMode changed to:', newValue)
}, { immediate: true })

// Toggle settings panel visibility
function toggleSettingsPanel() {
  isSettingsPanelVisible.value = !isSettingsPanelVisible.value
}
</script>

<template>
  <div class="min-h-screen text-gray-900 dark:text-white" style="background-color: var(--background-color)">
    <!-- Navigation bar -->
    <Navbar @toggle-settings="toggleSettingsPanel" />
    
    <!-- Main content with padding for navbar -->
    <main class="pt-16 pb-8">
      <router-view></router-view>
    </main>
    
    <!-- Settings panel (slide out from right) -->
    <SettingsPanel 
      :is-visible="isSettingsPanelVisible" 
      @close="isSettingsPanelVisible = false"
      @save="isSettingsPanelVisible = false"
    />
    
    <!-- Debug Menu -->
    <DebugMenu />
  </div>
</template>
