<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useBreathingStore } from '@/stores/breathingStore'
import { BreathPhase } from '@/types'

const store = useBreathingStore()

// State
const synth = ref<SpeechSynthesis | null>(null)
const voices = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref<SpeechSynthesisVoice | null>(null)
const selectedVoiceIndex = ref<number>(-1)
const selectedVoiceURI = ref<string>('')
const isMuted = ref(true)
const volume = ref(1.0)
const rate = ref(0.9) // slightly slower than normal for guidance
const pitch = ref(1.0)
// Speech queue
const speechQueue = ref<string[]>([])
const isSpeaking = ref(false)
// Show debug display (can be toggled for testing)
const showDebug = ref(true)

// Initialize speech synthesis
onMounted(() => {
  // Check if the browser supports speech synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synth.value = window.speechSynthesis
    
    // Get available voices
    const loadVoices = () => {
      voices.value = synth.value?.getVoices() || []
      
      // Check if there's a previously selected voice URI (more reliable than index)
      const savedVoiceURI = localStorage.getItem('selectedVoiceURI')
      
      if (savedVoiceURI) {
        // Try to find the voice by URI
        const matchingVoice = voices.value.find(voice => voice.voiceURI === savedVoiceURI)
        if (matchingVoice) {
          selectedVoice.value = matchingVoice
          selectedVoiceURI.value = matchingVoice.voiceURI
          selectedVoiceIndex.value = voices.value.findIndex(v => v.voiceURI === savedVoiceURI)
          console.log('Using saved voice:', matchingVoice.name, 'URI:', matchingVoice.voiceURI)
        } else {
          fallbackToDefaultVoice()
        }
      } else {
        fallbackToDefaultVoice()
      }
    }
    
    // Fallback logic for selecting a default voice
    const fallbackToDefaultVoice = () => {
      // Try to find a female English voice, or fall back to the first available
      const englishVoice = voices.value.find(voice => 
        voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
      ) || voices.value.find(voice => 
        voice.lang.includes('en')
      ) || voices.value[0]
      
      if (englishVoice) {
        selectedVoice.value = englishVoice
        selectedVoiceURI.value = englishVoice.voiceURI
        selectedVoiceIndex.value = voices.value.findIndex(v => v.voiceURI === englishVoice.voiceURI)
        console.log('Selected default voice:', englishVoice.name, 'URI:', englishVoice.voiceURI)
      }
    }
    
    // Firefox loads voices immediately, Chrome loads them asynchronously
    loadVoices()
    
    // Chrome needs this event to load voices
    synth.value.onvoiceschanged = loadVoices
  } else {
    console.warn('Speech synthesis not supported in this browser')
  }
})

// Clean up
onBeforeUnmount(() => {
  if (synth.value) {
    clearSpeech()
  }
})

// Process the speech queue
function processSpeechQueue() {
  // If we're already speaking or the queue is empty, or muted, don't do anything
  if (isSpeaking.value || speechQueue.value.length === 0 || isMuted.value || !synth.value) {
    return
  }
  
  // Set speaking flag
  isSpeaking.value = true
  
  // Get the next text to speak
  const text = speechQueue.value.shift()
  
  if (!text) {
    isSpeaking.value = false
    return
  }
  
  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text)
  
  // Set properties
  if (selectedVoice.value) {
    utterance.voice = selectedVoice.value
  }
  utterance.volume = volume.value
  utterance.rate = rate.value
  utterance.pitch = pitch.value
  
  // Handle utterance end to process next item in queue
  utterance.onend = () => {
    isSpeaking.value = false
    processSpeechQueue()
  }
  
  // Handle errors
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event)
    isSpeaking.value = false
    processSpeechQueue()
  }
  
  // Speak
  synth.value.speak(utterance)
}

// Speak a given text by adding it to the queue
function speak(text: string) {
  if (!synth.value || isMuted.value) return
  
  // Add to queue
  speechQueue.value.push(text)
  
  // Process queue
  processSpeechQueue()
}

// Clear the speech queue and cancel any ongoing speech
function clearSpeech() {
  if (!synth.value) return
  
  // Cancel any ongoing speech
  synth.value.cancel()
  
  // Clear queue
  speechQueue.value = []
  
  // Reset speaking state
  isSpeaking.value = false
}

// Test voice regardless of mute state
function testVoice(text: string) {
  if (!synth.value) return
  
  // Save current mute state
  const wasMuted = isMuted.value
  
  // Clear any existing speech
  clearSpeech()
  
  // Temporarily unmute if needed
  if (wasMuted) {
    isMuted.value = false
  }
  
  // Speak the text
  speak(text)
  
  // Restore mute state
  if (wasMuted) {
    // Use setTimeout to ensure the test message is processed before muting
    setTimeout(() => {
      isMuted.value = true
    }, 100)
  }
  
  console.log('Test voice executed with text:', text)
}

// Announce the current phase
function announcePhase(phase: BreathPhase) {
  // Don't announce anything in STANDBY phase
  if (phase === BreathPhase.STANDBY) return;
  
  // Clear the speech queue for new phase announcements
  // This is one case where we want to prioritize the new announcement
  if (phase !== BreathPhase.PREPARE) {
    clearSpeech();
  }
  
  let message = ''
  let phaseDuration = 0
  
  // Get the current timer set being used
  const currentSet = store.currentExercise.timerSets[store.session.currentSetIndex || 0]
  
  switch (phase) {
    case BreathPhase.PREPARE:
      message = 'Get ready'
      break
    case BreathPhase.INHALE:
      phaseDuration = currentSet.inhaleTime
      message = `Inhale for ${phaseDuration}`
      break
    case BreathPhase.HOLD_AFTER_INHALE:
      phaseDuration = currentSet.holdAfterInhaleTime
      message = `Hold for ${phaseDuration}`
      break
    case BreathPhase.EXHALE:
      phaseDuration = currentSet.exhaleTime
      message = `Exhale for ${phaseDuration}`
      break
    case BreathPhase.HOLD_AFTER_EXHALE:
      phaseDuration = currentSet.holdAfterExhaleTime
      message = `Hold for ${phaseDuration}`
      break
    case BreathPhase.COMPLETED:
      message = 'Exercise completed'
      break
  }
  
  speak(message)
}

// Announce countdown
function announceCountdown(time: number) {
  // Special announcements for PREPARE phase
  if (store.session.currentPhase === BreathPhase.PREPARE) {
    if (time === 3) {
      speak('Get Ready in Three')
    } else if (time === 2) {
      speak('Two')
    } else if (time === 1) {
      speak('One')
    }
  } 
  // For other phases, only announce at specific intervals to avoid queue flooding
  else if (store.session.currentPhase !== BreathPhase.STANDBY && 
           store.session.currentPhase !== BreathPhase.COMPLETED) {
    // Only announce every 5 seconds or the last 3 seconds
    if (time % 5 === 0 || time <= 3) {
      speak(time.toString())
    }
  }
}

// Watch for changes in the breathing phase
watch(() => store.session.currentPhase, (newPhase) => {
  announcePhase(newPhase)
})

// Watch for changes in the time remaining
watch(() => store.session.timeRemaining, (newTime) => {
  announceCountdown(newTime)
})

// Toggle mute
function toggleMute() {
  isMuted.value = !isMuted.value
  
  if (isMuted.value) {
    clearSpeech()
  } else {
    speak('Voice guidance enabled')
  }
}

// Change selected voice
function changeVoice(event: Event) {
  const select = event.target as HTMLSelectElement
  const voiceIndex = parseInt(select.value)
  
  if (voices.value[voiceIndex]) {
    const newVoice = voices.value[voiceIndex]
    selectedVoiceIndex.value = voiceIndex
    selectedVoice.value = newVoice
    selectedVoiceURI.value = newVoice.voiceURI
    
    // Save both index and URI to localStorage for better reliability
    localStorage.setItem('selectedVoiceIndex', voiceIndex.toString())
    localStorage.setItem('selectedVoiceURI', newVoice.voiceURI)
    
    console.log('Voice changed to:', newVoice.name, 'URI:', newVoice.voiceURI)
    
    // Force a refresh in case the voices array has changed
    if (synth.value) {
      const freshVoices = synth.value.getVoices()
      if (freshVoices.length > 0) {
        voices.value = freshVoices
        // Find the matching voice by URI which is more reliable
        const matchingVoice = freshVoices.find(v => 
          v.voiceURI === selectedVoice.value?.voiceURI
        )
        if (matchingVoice) {
          selectedVoice.value = matchingVoice
          console.log('Refreshed voice reference to:', matchingVoice.name)
        }
      }
    }
    
    // Give feedback if unmuted
    if (!isMuted.value) {
      // Use a small delay to make sure the voice change takes effect
      setTimeout(() => {
        speak('Voice changed to ' + newVoice.name)
      }, 100)
    }
  }
}

// Adjust volume
function adjustVolume(event: Event) {
  const input = event.target as HTMLInputElement
  volume.value = parseFloat(input.value)
}

// Adjust speech rate
function adjustRate(event: Event) {
  const input = event.target as HTMLInputElement
  rate.value = parseFloat(input.value)
}

// Get queue status
function getQueueStatus() {
  return {
    queueLength: speechQueue.value.length,
    isSpeaking: isSpeaking.value,
    currentQueue: [...speechQueue.value]
  }
}

// Expose functions and properties
defineExpose({
  toggleMute,
  isMuted,
  speak,
  testVoice,
  voices,
  selectedVoiceIndex,
  changeVoice,
  adjustRate,
  adjustVolume,
  clearSpeech,
  getQueueStatus,
  speechQueue,
  showDebug
})
</script>

<template>
  <div class="speech-synthesis">
    <button 
      @click="toggleMute" 
      class="p-2 rounded-full hover:bg-slate-300 dark:hover:bg-neon-pink/20 transition"
      :title="isMuted ? 'Enable voice guidance' : 'Disable voice guidance'"
    >
      <!-- Muted icon -->
      <svg v-if="isMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
      
      <!-- Unmuted icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 dark:text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </button>
    
    <!-- Debug info - toggled with showDebug flag -->
    <div v-if="showDebug" class="speech-debug">
      <div class="speech-debug-content">
        <div class="speech-debug-status">
          <span :class="isSpeaking ? 'active' : ''">{{ isSpeaking ? 'Speaking' : 'Silent' }}</span>
          <span>Queue: {{ speechQueue.length }}</span>
        </div>
        <div v-if="speechQueue.length > 0" class="speech-debug-queue">
          <div v-for="(item, index) in speechQueue" :key="index" class="speech-queue-item">
            {{ index === 0 ? '→ ' : '' }}{{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speech-synthesis {
  position: relative;
}

.speech-debug {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  min-width: 150px;
}

.speech-debug-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.speech-debug-status .active {
  color: #4ade80;
}

.speech-debug-queue {
  max-height: 80px;
  overflow-y: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 2px;
}

.speech-queue-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 