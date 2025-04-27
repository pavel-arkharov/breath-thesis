# Breathing Exercise App

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://pavel-arkharov.github.io/breath-thesis/)
[![GitHub Actions](https://github.com/pavel-arkharov/breath-thesis/actions/workflows/deploy.yml/badge.svg)](https://github.com/pavel-arkharov/breath-thesis/actions)

A modern breathing exercise application built with Vue 3 and Tailwind CSS v4. Features include customizable breathing patterns, dark mode, and background audio.

## Features

- Customizable breathing patterns (inhale, hold, exhale, hold)
- Multiple timer sets
- Configurable rounds
- Dark mode support
- Background audio with crossfade
- Mobile-friendly design

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Live Demo

Visit the live application: [Breathing Exercise App](https://pavel-arkharov.github.io/breath-thesis/)

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
