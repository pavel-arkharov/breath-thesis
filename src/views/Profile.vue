<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Show loading state -->
    <div v-if="userStore.userLoading" class="flex justify-center items-center py-10">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    
    <!-- Show content when loaded -->
    <div v-else-if="userStore.isAuthenticated" class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Profile</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ userStore.user?.email }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              User ID: {{ userStore.user?.uid.substring(0, 8) + '...' }}
            </p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">User Settings</h3>
          
          <div class="space-y-4">
            <!-- Dark Mode Toggle -->
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" 
                  :checked="userStore.userSettings.darkMode"
                  @change="userStore.toggleDarkMode"
                  class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Sign Out
          </button>
        </div>
      </div>
    </div>
    
    <!-- Not authenticated -->
    <div v-else class="text-center py-10">
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
        You need to be signed in to view your profile
      </p>
      <router-link to="/login" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script> 