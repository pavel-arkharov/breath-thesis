<script setup lang="ts">
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const isSettingsPanelVisible = ref(false)

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
  </div>
</template>
