// Breathing phase types
export enum BreathPhase {
  PREPARE = 'PREPARE',
  INHALE = 'INHALE',
  HOLD_AFTER_INHALE = 'HOLD',
  EXHALE = 'EXHALE',
  HOLD_AFTER_EXHALE = 'HOLD_AFTER_EXHALE',
  COMPLETED = 'COMPLETED'
}

// Timer format options
export enum TimerFormat {
  SIMPLE = 'SIMPLE', // Just numbers (3, 2, 1)
  TIME = 'TIME'      // Time format (MM:SS)
}

// Timer set configuration
export interface TimerSet {
  id: string;
  inhaleTime: number;
  holdAfterInhaleTime: number;
  exhaleTime: number;
  holdAfterExhaleTime: number;
}

// Complete breathing exercise configuration
export interface BreathingExercise {
  timerSets: TimerSet[];
  rounds: number;
}

// Session state
export interface SessionState {
  currentPhase: BreathPhase;
  currentRound: number;
  currentSetIndex: number;
  timeRemaining: number;
  isRunning: boolean;
  totalRounds: number;
}

// User preferences
export interface UserPreferences {
  darkMode: boolean;
  timerFormat: TimerFormat;
  savedExercises: BreathingExercise[];
  lastUsedExercise?: BreathingExercise;
} 