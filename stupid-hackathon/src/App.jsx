import { useState, useCallback } from 'react'
import GameCanvas from './game/GameCanvas'
import StartScreen from './ui/StartScreen'
import DeadScreen from './ui/DeadScreen'
import CalibrationScreen from './ui/CalibrationScreen'
import { setupMic, calibrateBaseline } from './audio/micInput'

// States: IDLE | REQUESTING | CALIBRATING | PLAYING | DEAD
export default function App() {
  const [gameState, setGameState] = useState('IDLE')
  const [score, setScore] = useState(0)
  const [micError, setMicError] = useState(null)
  const [mic, setMic] = useState(null)
  const [screamThreshold, setScreamThreshold] = useState(0.02) // default fallback threshold (RMS scale)

  const requestMicAndStart = useCallback(async () => {
    setGameState('REQUESTING')
    setMicError(null)
    try {
      const mic = await setupMic()
      setMic(mic)

      // Calibrate for 1 second — measure room noise
      setGameState('CALIBRATING')
      const baseline = await calibrateBaseline(mic.analyser, 1000)

      // RMS scale: baseline in quiet room ≈ 0.002, blowing ≈ 0.05–0.30
      // Margin of 0.015 clears ambient noise, minimum 0.01
      const margin = 0.015
      setScreamThreshold(Math.max(baseline + margin, 0.01))

      setScore(0)
      setGameState('PLAYING')
    } catch {
      setMic(null)
      setScreamThreshold(0.02)
      setMicError('Mic blocked. Hold SPACE or click to flap.')
      setScore(0)
      setGameState('PLAYING')
    }
  }, [])

  const handleDead = useCallback((finalScore) => {
    setScore(finalScore)
    setGameState('DEAD')
  }, [])

  const handleRestart = useCallback(async () => {
    if (mic) {
      // Re-calibrate on every restart in case room noise changed
      setGameState('CALIBRATING')
      const baseline = await calibrateBaseline(mic.analyser, 1000)
      setScreamThreshold(Math.max(baseline + 0.015, 0.01))
      setScore(0)
      setGameState('PLAYING')
    } else {
      await requestMicAndStart()
    }
  }, [mic, requestMicAndStart])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {gameState === 'IDLE' && (
        <StartScreen onStart={requestMicAndStart} />
      )}

      {gameState === 'REQUESTING' && (
        <div style={{ color: '#FFD700', fontFamily: 'monospace', fontSize: 22, textAlign: 'center', gap: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 48 }}>🎤</div>
          <div>Waiting for mic permission...</div>
        </div>
      )}

      {gameState === 'CALIBRATING' && <CalibrationScreen />}

      {gameState === 'PLAYING' && (
        <GameCanvas
          onDead={handleDead}
          analyser={mic?.analyser ?? null}
          screamThreshold={screamThreshold}
        />
      )}

      {gameState === 'DEAD' && (
        <DeadScreen score={score} onRestart={handleRestart} micError={micError} />
      )}
    </div>
  )
}
