# Blow Flap

Blow Flap is a tiny voice-controlled Flappy Bird game built for a stupid hackathon. Instead of tapping a button, you blow into the microphone to keep the bird alive.

The rules are simple: make noise to rise, go quiet to fall, dodge the pipes, and try not to look too dignified while yelling at a browser game.

## Gameplay

- Click **Start** and allow microphone access.
- Stay quiet during the short calibration step so the game can measure room noise.
- Blow, shout, or make loud enough audio to flap upward.
- Stop making noise to let the bird fall.
- Pass pipes to score points.
- Hit a pipe or the ground and the run ends.
- If microphone access is blocked, hold **Space** or press/click the canvas as a fallback input.

## Why It Exists

This was made for a stupid hackathon: the kind of project where the idea is deliberately ridiculous, but the implementation still has to work. The joke is the input method. The game itself is a real browser game with microphone calibration, canvas rendering, pipe spawning, collision detection, scoring, and restart flow.

## Tech Stack

- React
- Vite
- Canvas 2D
- Web Audio API
- ESLint

## Project Structure

```text
stupid-hackathon/
  src/
    App.jsx                  Screen state and mic calibration flow
    audio/micInput.js        Microphone setup and RMS volume detection
    game/GameCanvas.jsx      Canvas game loop and input plumbing
    game/bird.js             Bird movement and rendering
    game/pipes.js            Pipe spawning, drawing, movement, scoring
    game/collision.js        Bird-to-pipe collision checks
    game/constants.js        Gameplay tuning values
    ui/                      Start, calibration, and death screens
```

## Local Development

```sh
cd stupid-hackathon
npm install
npm run dev
```

Then open the local Vite URL in a browser.

## Build

```sh
cd stupid-hackathon
npm run build
npm run lint
```

## Deploying On Vercel

Import this GitHub repository into Vercel. The repo includes `vercel.json`, so Vercel can build the app from `stupid-hackathon` and serve `stupid-hackathon/dist` without moving files around.

## Notes

The microphone input uses RMS loudness from the Web Audio API. On startup, the app samples ambient room noise for one second and sets a threshold slightly above that baseline. This makes the game adapt to quieter or louder rooms without requiring a settings screen.
