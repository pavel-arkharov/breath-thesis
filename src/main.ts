import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import './assets/darkmode.css'

// Import router from the router file
import router from './router'
import { useUserStore } from './stores/userStore'

// Click outside directive
interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

interface ClickOutsideBinding {
  value: () => void;
}

const clickOutside = {
  beforeMount(el: ClickOutsideElement, binding: ClickOutsideBinding) {
    console.log('Installing click-outside directive on element:', el);
    el.clickOutsideEvent = (event: Event) => {
      console.log('Click outside event triggered');
      // Check if the clicked element is not the menu or contained within the menu
      if (!(el === event.target || el.contains(event.target as Node))) {
        console.log('Click was outside - calling handler');
        binding.value();
      } else {
        console.log('Click was inside - ignoring');
      }
    };
    
    // Use a small timeout to ensure proper DOM update before adding the listener
    setTimeout(() => {
      if (el.clickOutsideEvent) {
        document.addEventListener('click', el.clickOutsideEvent);
        console.log('Click-outside listener installed');
      }
    }, 0);
  },
  unmounted(el: ClickOutsideElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent);
      console.log('Click-outside listener removed');
    }
  },
};

// Create pinia store
const pinia = createPinia()

// Create the app
const app = createApp(App)
app.use(router)
app.use(pinia)

// Register global directives
app.directive('click-outside', clickOutside)

// Initialize auth before mounting the app
const initApp = async () => {
  // Get the user store - this needs to happen after pinia is installed
  const userStore = useUserStore()
  
  try {
    // Initialize authentication - we need to call this once at the start
    const unsubscribe = userStore.initAuth()
    console.log('Auth initialization started')
  } catch (error) {
    console.error('Failed to initialize auth:', error)
  }
  
  // Mount the app
  app.mount('#app')
}

// Start the application
initApp().catch(error => {
  console.error('Failed to initialize application:', error)
  // Still mount the app even if auth init fails
  app.mount('#app')
})
