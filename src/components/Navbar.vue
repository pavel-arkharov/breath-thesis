<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBreathingStore } from '@/stores/breathingStore'
import { useUserStore } from '@/stores/userStore'
import AudioPlayer from './AudioPlayer.vue'
import SpeechSynthesis from './SpeechSynthesis.vue'
import AboutModal from './AboutModal.vue'

const router = useRouter()
const breathingStore = useBreathingStore()
const userStore = useUserStore()
const showAboutModal = ref(false)
const showUserMenu = ref(false)

// Initialize auth and click handler
onMounted(() => {
  console.log('Navbar: onMounted - Initializing auth');
  userStore.initAuth();
  console.log('Navbar: Auth state -', 
    'isAuthenticated:', userStore.isAuthenticated,
    'userLoading:', userStore.userLoading,
    'user:', userStore.user);
  
  // Watch for auth state changes
  watch(() => userStore.isAuthenticated, (newValue) => {
    console.log('Navbar: Auth state changed - isAuthenticated:', newValue);
  });
  
  watch(() => userStore.userLoading, (newValue) => {
    console.log('Navbar: Auth loading state changed -', newValue);
  });
  
  // Add a document click handler to close the user menu when clicking outside
  document.addEventListener('click', handleDocumentClick);
});

// Clean up on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});

// Handle document clicks to close the user menu when clicking outside
function handleDocumentClick(event: MouseEvent) {
  // Get the user menu pill and dropdown
  const userMenuPill = document.querySelector('.user-menu-pill');
  const userMenu = document.querySelector('.user-menu-dropdown');
  
  // Check if the click was outside both the menu and the pill
  if (showUserMenu.value && 
      userMenuPill && 
      userMenu && 
      !userMenuPill.contains(event.target as Node) && 
      !userMenu.contains(event.target as Node)) {
    console.log('Document click outside user menu - closing menu');
    showUserMenu.value = false;
  }
}

// Emit toggle settings event
const emit = defineEmits(['toggle-settings'])

// Navigate to settings page - replaced with toggle action
function toggleSettings() {
  emit('toggle-settings')
}

// Toggle dark mode
function toggleDarkMode() {
  console.log('Navbar: toggleDarkMode clicked, current state:', userStore.userSettings.darkMode)
  userStore.toggleDarkMode()
  console.log('Navbar: after toggle, new state:', userStore.userSettings.darkMode)
}

// Toggle about modal
function toggleAboutModal() {
  showAboutModal.value = !showAboutModal.value
}

// Toggle user menu
function toggleUserMenu() {
  console.log('Toggle user menu clicked, current state:', showUserMenu.value);
  showUserMenu.value = !showUserMenu.value;
  console.log('User menu toggled to:', showUserMenu.value);
}

// Close user menu when clicking outside
function closeUserMenu() {
  showUserMenu.value = false
}

// Handle logout
async function handleLogout() {
  try {
    await userStore.logout()
    showUserMenu.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Watch for dark mode changes and update CSS variables
watch(() => userStore.userSettings.darkMode, (isDark) => {
  if (isDark) {
    document.documentElement.style.setProperty('--settings-color', '#1E90FF');
    document.documentElement.style.setProperty('--info-color', '#00FF85');
  } else {
    document.documentElement.style.setProperty('--settings-color', '#4B5563');
    document.documentElement.style.setProperty('--info-color', '#4B5563');
  }
}, { immediate: true })

// Return the appropriate icon color based on dark mode state
const getIconColor = (darkModeColor: string, lightModeColor: string = '#4B5563') => {
  return userStore.userSettings.darkMode ? darkModeColor : lightModeColor;
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-slate-200 dark:bg-slate-800 shadow-md py-2 px-4 z-50">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo/Title -->
      <div class="text-xl font-bold text-gray-900 dark:text-white">
        <router-link to="/" class="hover:opacity-80">Breathing Trainer</router-link>
      </div>
      
      <!-- Controls -->
      <div class="flex items-center space-x-4">
        <!-- Dark/Light mode toggle -->
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
          :title="userStore.userSettings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon (light mode) - Direct style and stroke attribute -->
          <svg v-if="userStore.userSettings.darkMode" xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" fill="none" viewBox="0 0 24 24" 
               :stroke="getIconColor('#00FF85')" style="color: #00FF85 !important;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          
          <!-- Moon icon (dark mode) - Direct style and stroke attribute -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" fill="none" viewBox="0 0 24 24" 
               stroke="#4B5563" style="color: #4B5563 !important;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <!-- Speech Synthesis toggle -->
        <SpeechSynthesis />
        
        <!-- Audio Player -->
        <AudioPlayer />
        
        <!-- Settings button with direct stroke attribute -->
        <button 
          @click="toggleSettings" 
          class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" fill="none" viewBox="0 0 24 24" 
               :stroke="getIconColor('#1E90FF')" style="color: var(--settings-color, #4B5563) !important;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <!-- About/Info button with direct stroke attribute -->
        <button 
          @click="toggleAboutModal" 
          class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
          title="About"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-6 w-6" fill="none" viewBox="0 0 24 24" 
               :stroke="getIconColor('#00FF85')" style="color: var(--info-color, #4B5563) !important;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- User Menu -->
        <div class="relative ml-2">
          <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-full px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer user-menu-pill" @click="toggleUserMenu">
            <!-- Username/Guest display -->
            <div class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ userStore.isAuthenticated ? userStore.user?.email?.split('@')[0] : 'Guest' }}
            </div>
            
            <!-- User button/icon -->
            <div class="user-menu-button flex items-center justify-center">
              <!-- User icon when not logged in -->
              <svg v-if="!userStore.isAuthenticated" xmlns="http://www.w3.org/2000/svg" 
                   class="h-6 w-6" fill="none" viewBox="0 0 24 24" 
                   :stroke="getIconColor('#1E90FF')" style="color: var(--settings-color, #4B5563) !important;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              
              <!-- User avatar when logged in -->
              <div v-else class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {{ userStore.user?.email?.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
          
          <!-- User dropdown menu -->
          <div v-if="showUserMenu" 
               class="user-menu-dropdown absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
               v-click-outside="closeUserMenu">
            <div class="text-center py-2 bg-blue-100 dark:bg-blue-900 text-sm font-medium text-blue-700 dark:text-blue-200">
              {{ userStore.isAuthenticated ? 'Logged in as' : 'Not logged in' }}
              <div v-if="userStore.isAuthenticated" class="mt-1 text-blue-800 dark:text-blue-100 font-bold">
                {{ userStore.user?.email }}
              </div>
            </div>
            <!-- Not logged in menu -->
            <template v-if="!userStore.isAuthenticated">
              <router-link to="/login" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Sign In
              </router-link>
              <router-link to="/register" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Register
              </router-link>
            </template>
            
            <!-- Logged in menu -->
            <template v-else>
              <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </router-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                Sign Out
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- About Modal -->
  <AboutModal :is-visible="showAboutModal" @close="showAboutModal = false" />
</template> 

<style scoped>
/* Force navbar icon colors to be visible in dark mode */
:global(.dark) button svg {
  stroke: currentColor !important;
  color: inherit !important;
  visibility: visible !important;
  opacity: 1 !important;
}

:global(.dark) button:nth-child(1) svg {
  color: #00FF85 !important;
  stroke: #00FF85 !important;
}

:global(.dark) button:nth-child(4) svg {
  color: #1E90FF !important;
  stroke: #1E90FF !important;
}

:global(.dark) button:nth-child(5) svg {
  color: #00FF85 !important;
  stroke: #00FF85 !important;
}
</style> 