import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export interface UserSettings {
  darkMode: boolean;
  // Add more user settings as needed
}

// Get saved dark mode preference from localStorage
const getSavedDarkMode = (): boolean => {
  try {
    const savedMode = localStorage.getItem('darkMode');
    // Return the saved preference if available
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Otherwise return system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.error('Error reading dark mode preference:', error);
    return false;
  }
};

export const useUserStore = defineStore('user', () => {
  // User state
  const user = ref<User | null>(null);
  const userLoading = ref(true);
  const userError = ref<string | null>(null);
  
  // User settings - Initialize darkMode from localStorage
  const userSettings = ref<UserSettings>({
    darkMode: getSavedDarkMode(),
  });

  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  
  // Apply initial dark mode on store creation
  applyDarkMode(userSettings.value.darkMode);
  
  // Initialize auth state listener
  const initAuth = () => {
    console.log('Initializing auth state listener');
    userLoading.value = true;
    
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      userLoading.value = true;
      console.log('Auth state changed:', authUser ? 'User logged in' : 'User logged out');
      
      if (authUser) {
        user.value = authUser;
        // Load user settings from Firestore
        await loadUserSettings();
      } else {
        user.value = null;
        // Load settings from localStorage when not logged in
        userSettings.value = {
          darkMode: getSavedDarkMode(),
        };
        // Apply dark mode based on localStorage
        applyDarkMode(userSettings.value.darkMode);
      }
      
      userLoading.value = false;
    }, (error) => {
      console.error('Auth state change error:', error);
      userError.value = error.message;
      userLoading.value = false;
    });
    
    // Return unsubscribe function for cleanup
    return unsubscribe;
  };
  
  // Register a new user
  const register = async (email: string, password: string): Promise<UserCredential> => {
    userError.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore with default settings
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        settings: {
          darkMode: userSettings.value.darkMode, // Preserve current dark mode setting
        },
        createdAt: serverTimestamp(),
      });
      
      return userCredential;
    } catch (error: any) {
      console.error('Registration error:', error);
      userError.value = error.message;
      throw error;
    }
  };
  
  // Sign in existing user
  const login = async (email: string, password: string): Promise<UserCredential> => {
    userError.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error: any) {
      console.error('Login error:', error);
      userError.value = error.message;
      throw error;
    }
  };
  
  // Sign out
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      userError.value = error.message;
      throw error;
    }
  };
  
  // Load user settings from Firestore
  const loadUserSettings = async (): Promise<void> => {
    if (!user.value) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.value.uid));
      
      if (userDoc.exists() && userDoc.data().settings) {
        userSettings.value = userDoc.data().settings;
        // Apply dark mode settings
        applyDarkMode(userSettings.value.darkMode);
      }
    } catch (error: any) {
      console.error('Error loading user settings:', error);
    }
  };
  
  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>): Promise<void> => {
    if (!user.value) return;
    
    try {
      // Update local state
      userSettings.value = { ...userSettings.value, ...settings };
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.value.uid), {
        settings: userSettings.value,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  };
  
  // Toggle dark mode and save to user settings
  const toggleDarkMode = async (): Promise<void> => {
    const newDarkMode = !userSettings.value.darkMode;
    
    // Update local state
    userSettings.value.darkMode = newDarkMode;
    
    // Apply dark mode changes to the UI immediately
    applyDarkMode(newDarkMode);
    
    // Save to user settings in Firestore if logged in
    if (user.value) {
      await updateUserSettings({ darkMode: newDarkMode });
    } else {
      // Save to local storage if not logged in
      localStorage.setItem('darkMode', newDarkMode.toString());
    }
  };
  
  // Helper function to apply dark mode
  function applyDarkMode(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Set a specific meta tag for some browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#f9fafb');
    }
  }
  
  return {
    user,
    userLoading,
    userError,
    userSettings,
    isAuthenticated,
    initAuth,
    register,
    login,
    logout,
    loadUserSettings,
    updateUserSettings,
    toggleDarkMode,
  };
}); 