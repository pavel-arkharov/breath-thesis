import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Import views
import Home from '../views/Home.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';

// Define routes
const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    component: Home, 
    name: 'home',
    meta: { requiresAuth: false }
  },
  { 
    path: '/settings', 
    component: Settings, 
    name: 'settings',
    meta: { requiresAuth: false }
  },
  { 
    path: '/login', 
    component: Login, 
    name: 'login',
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  { 
    path: '/register', 
    component: Register, 
    name: 'register',
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  { 
    path: '/profile', 
    component: Profile, 
    name: 'profile',
    meta: { requiresAuth: true }
  },
];

// Get the base URL for the router (for GitHub Pages deployment)
const baseUrl = '/'; 

// Create router instance
const router = createRouter({
  history: createWebHistory(baseUrl),
  routes
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // Wait for auth to initialize on first navigation
  if (!userStore.user && !userStore.userLoading) {
    // Initialize auth only once
    userStore.initAuth();
  }
  
  // If auth is still loading, show loading state or splash screen
  if (userStore.userLoading) {
    console.log('Auth is still initializing, waiting...');
    // Can add a delay here if needed with await new Promise(r => setTimeout(r, 500))
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth);
  
  if (requiresAuth && !userStore.isAuthenticated) {
    // User is not authenticated but the route requires auth
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (redirectIfAuth && userStore.isAuthenticated) {
    // User is authenticated but the route should redirect if authenticated (like login/register)
    next({ name: 'home' });
  } else {
    // All other cases, proceed as normal
    next();
  }
});

export default router; 