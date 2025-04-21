# Breathing Trainer

A web-based breathing exercise application built with Vue 3. This app guides users through customizable breathing exercises with alternating breathing cycles (inhale–hold–exhale–hold) and visual feedback.

## Features

- **Four-phase breathing loop**: Inhale, Hold, Exhale, Hold
- **Customizable timers**: Set durations for each phase
- **Multiple timer sets**: Create different breathing patterns in sequence
- **Visual feedback**: Animated breathing circle that shows progress
- **Dark/Light mode**: Toggle between themes with persistence
- **Responsive design**: Works on desktop and mobile devices

## Technologies Used

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vue Router** for navigation
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or later recommended)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/breathing-trainer.git
cd breathing-trainer
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Building for Production

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
breathing-trainer/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Vue components
│   ├── composables/     # Reusable composition functions
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript type definitions
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   ├── main.ts          # Application entry point
│   └── style.css        # Global styles and Tailwind imports
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Usage

1. **Start Page**: Click "Start" to begin a breathing session with default settings
2. **Settings**: Customize:
   - Duration for each phase (inhale, hold, exhale, hold)
   - Add/remove timer sets
   - Number of rounds
3. **During Session**:
   - The circle indicates the current phase
   - The timer counts down the remaining time
   - Use Pause/Resume/Stop buttons to control the session

## Future Enhancements

- User accounts for saving custom breathing patterns
- Statistics and session history
- Guided breathing sessions with audio
- Mobile app version with offline support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed as part of a Bachelor's thesis project in Business Administration (Web & Mobile Development focus)
