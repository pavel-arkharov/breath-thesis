# Design Directives - Clarifications Summary

## ✅ Key Clarifications Received

### 1. **Current Settings Display**
- ✅ **Always visible** in setup state (no accordion needed)
- ✅ Shown as a card on the main page by default
- ✅ Displays timer sets preview + rounds count
- ✅ Hidden when exercise state starts
- ✅ Settings panel (slide-out) is for detailed editing only

### 2. **Two-State System**
- **Setup State:**
  - Presets section (collapsible, collapsed by default)
  - Current Settings card (always visible)
  - "Start" button at bottom (visible)
  - User can configure exercise

- **Countdown (PREPARE phase):**
  - Button becomes hidden/invisible
  - Timer shows countdown (3, 2, 1)

- **Exercise State:**
  - Timer circle (full-screen focus)
  - Round info above timer
  - Phase label below timer
  - "Stop" button at bottom (same position as Start)
  - Presets & Settings fade out

### 2.1 **Primary Button** ✅ CLARIFIED
- ✅ **Single button** that morphs between states (not separate buttons)
- ✅ **Setup State:** Shows "Start" button (visible, persistent bottom)
- ✅ **Countdown (PREPARE):** Button hidden/invisible
- ✅ **Exercise State:** Shows "Stop" button (same position)
- ✅ Button stays in same location, only label and style change
- ✅ Smooth transition between states

### 3. **Navigation Behavior**
- ✅ **Nav state persists** across setup/exercise states
- ✅ If nav was open, it stays open
- ✅ If nav was collapsed, it stays collapsed
- ✅ No automatic state changes when transitioning between states

### 4. **Post-Session State**
- ✅ "Start Over" button (starts new session)
- ✅ "To Menu" button (returns to setup state)
- ✅ Confirmed as correct behavior

### 5. **Desktop Session Layout**
- ✅ Right column is optional
- ✅ **Option 1:** Leave empty (clean, focused view) - **Recommended**
- ✅ **Option 2:** Show presets accordion (same from start page, hidden by default)
- ✅ Recommendation: Start with empty, add presets if users request it

---

## 🎯 Implementation Notes

### Current Settings Card
- **Location:** Main page, always visible in setup state
- **Content:**
  - Timer sets preview (e.g., "4s – 4s – 4s – 4s" or compact tags)
  - Rounds summary (e.g., "Rounds 3×")
- **Style:** Same as preset cards (12px radius, 16px padding, border)
- **Behavior:** Fades out when exercise starts, fades in when returning to setup

### State Transitions
- **Setup → Countdown (PREPARE):**
  - Button becomes hidden/invisible
  - Timer shows countdown (3, 2, 1)
  - Duration: 3 seconds

- **Countdown → Exercise:**
  - Fade out: Presets section, Current Settings card
  - Fade in: Timer circle, Round info, Phase label
  - Button morphs to "Stop" (same position)
  - Duration: ~250ms
  - Nav: No change (persists)

- **Exercise → Setup:**
  - Fade out: Timer circle, Round info, Phase label
  - Fade in: Presets section, Current Settings card
  - Button morphs to "Start" (same position)
  - Duration: ~250ms
  - Nav: No change (persists)

### Presets Section
- **Default State:** Collapsed (hidden by default)
- **Location:** Start page (setup state)
- **Desktop Option:** Can be shown in right column during exercise (if needed)
- **Behavior:** User can expand/collapse, state persists

---

## 📋 Implementation Checklist

### Phase 1: Two-State System
- [ ] Implement Setup State layout
  - [ ] Presets section (collapsible, collapsed by default)
  - [ ] Current Settings card (always visible)
  - [ ] "Start" button (persistent bottom, visible)
- [ ] Implement Countdown (PREPARE) state
  - [ ] Button hidden/invisible
  - [ ] Timer shows countdown (3, 2, 1)
- [ ] Implement Exercise State layout
  - [ ] Timer circle (full-screen focus)
  - [ ] Round info above timer
  - [ ] Phase label below timer
  - [ ] "Stop" button (same position as Start)
- [ ] Implement morphing primary button
  - [ ] Single button component
  - [ ] States: "Start" → (hidden) → "Stop"
  - [ ] Smooth transition between states
- [ ] Implement state transitions (fade in/out, 250ms)

### Phase 2: Current Settings Card
- [ ] Create CurrentSettingsCard component
- [ ] Display timer sets preview
- [ ] Display rounds summary
- [ ] Style to match preset cards
- [ ] Show/hide based on state (setup vs exercise)

### Phase 3: Navigation Persistence
- [ ] Make nav state persistent across states
- [ ] Ensure nav doesn't change when transitioning
- [ ] Test nav behavior in both states

### Phase 4: Desktop Layout
- [ ] Implement two-column layout for setup state
- [ ] Implement centered timer for exercise state
- [ ] Add optional right column (empty by default)
- [ ] Test responsive behavior

---

## 🔄 User Flow (Clarified)

1. **User lands on Start screen (Setup State)**
   - Sees: Nav (as user left it) → Title → Presets (collapsed) → Current Settings (visible) → "Start" button
   
2. **User clicks Start**
   - Button becomes hidden/invisible
   - Enters Countdown (PREPARE phase)
   - Timer shows countdown (3, 2, 1)
   
3. **Countdown ends → Exercise State**
   - Fades out: Presets, Current Settings
   - Fades in: Timer, Round info, Phase label
   - Button morphs to "Stop" (same position)
   - Nav: No change (persists)
   
4. **During Exercise**
   - Timer visible, settings hidden
   - "Stop" button at bottom (same position as Start)
   - Nav: No change (persists)
   
5. **After Exercise**
   - "Start Over" button (new session)
   - "To Menu" button (return to setup)
   
6. **Return to Setup**
   - Fades out: Timer, Round info, Phase label
   - Fades in: Presets, Current Settings
   - Button morphs to "Start" (same position)
   - Nav: No change (persists)

---

## 💡 Key Insights

### Design Philosophy
- **Three states:** Setup (configuration) → Countdown (PREPARE) → Exercise (focus)
- **Morphing button:** Single button that changes between "Start" and "Stop" (hidden during countdown)
- **Persistent navigation:** User controls nav state, app doesn't change it
- **Always-visible settings:** Users should see what they're about to start (in setup state)
- **Clean exercise view:** Minimize distractions during breathing (button hidden during countdown)

### Implementation Priorities
1. ✅ Three-state system (Setup → Countdown → Exercise)
2. ✅ Morphing primary button (Start → hidden → Stop)
3. ✅ Current Settings card (always visible in setup)
4. ✅ Nav state persistence
5. ✅ State transitions (smooth fades)
6. ✅ Desktop layout options

---

*All clarifications received and documented. Ready for implementation.*

