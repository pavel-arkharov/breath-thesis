<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const showMenu = ref(false);

// Compute auth status for display
const authStatus = computed(() => {
  if (userStore.userLoading) return 'Loading...';
  return userStore.isAuthenticated ? 'Logged In' : 'Not Logged In';
});

function toggleMenu() {
  console.log('Menu toggled');
  showMenu.value = !showMenu.value;
}

function closeMenu() {
  console.log('Menu closed');
  showMenu.value = false;
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="toggleMenu"
      class="bg-blue-500 text-white p-2 rounded-full flex items-center"
    >
      <span class="mr-2">Debug</span>
      <div 
        class="h-3 w-3 rounded-full" 
        :class="{
          'bg-yellow-400': userStore.userLoading,
          'bg-green-400': !userStore.userLoading && userStore.isAuthenticated,
          'bg-red-400': !userStore.userLoading && !userStore.isAuthenticated
        }"
      ></div>
    </button>
    
    <div
      v-if="showMenu"
      class="absolute bottom-10 right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-64"
    >
      <div class="text-sm text-gray-900 dark:text-white mb-3">
        <div class="font-medium mb-1">Auth Status</div>
        <div class="flex justify-between">
          <span>Authentication:</span>
          <span 
            :class="{
              'text-yellow-500': userStore.userLoading,
              'text-green-500': !userStore.userLoading && userStore.isAuthenticated,
              'text-red-500': !userStore.userLoading && !userStore.isAuthenticated
            }"
          >
            {{ authStatus }}
          </span>
        </div>
        <div v-if="userStore.isAuthenticated" class="flex justify-between">
          <span>User:</span>
          <span class="text-blue-500">{{ userStore.user?.email }}</span>
        </div>
        <div class="flex justify-between">
          <span>Loading:</span>
          <span>{{ userStore.userLoading }}</span>
        </div>
      </div>
      <button
        @click="closeMenu"
        class="mt-2 w-full bg-red-500 text-white p-1 rounded"
      >
        Close
      </button>
    </div>
  </div>
</template> 