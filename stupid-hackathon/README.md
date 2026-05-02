# Blow Flap App

This folder contains the React/Vite game app for Blow Flap.

Blow Flap is a voice-controlled Flappy Bird style game: blow into the microphone to flap, stay quiet to fall, and dodge the pipes.

## How It Works

- The player starts the game and grants microphone access.
- The app listens quietly for one second to measure ambient room noise.
- During play, loud input above the calibrated threshold makes the bird rise.
- Silence makes the bird fall.
- If microphone access fails, holding Space or pressing/clicking the canvas acts as the fallback flap input.
- Passing a pipe adds one point.
- Touching a pipe or the ground ends the run.

## Scripts

```sh
npm install
npm run dev
npm run build
npm run lint
```

## Deploying

Deploy this folder as the Vercel project root:

```sh
vercel --prod
```

## Project Shape

- `src/App.jsx` owns the screen state machine and microphone calibration.
- `src/audio/micInput.js` sets up Web Audio and calculates RMS volume.
- `src/game/GameCanvas.jsx` runs the animation loop and canvas drawing.
- `src/game/bird.js` contains the scream-to-rise movement and bird rendering.
- `src/game/pipes.js` handles pipe spawning, movement, scoring, and drawing.
- `src/game/collision.js` checks bird-vs-pipe collisions.
- `src/ui/` contains the start, calibration, and death screens.
