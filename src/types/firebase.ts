import { User } from 'firebase/auth';

// User settings interface
export interface UserSettings {
  darkMode: boolean;
  // Add more user settings as needed later
}

// Firestore user document interface
export interface FirestoreUser {
  email: string;
  settings: UserSettings;
  createdAt: any; // FirebaseFirestore.Timestamp
  updatedAt?: any; // FirebaseFirestore.Timestamp
}

// Auth state interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
} 