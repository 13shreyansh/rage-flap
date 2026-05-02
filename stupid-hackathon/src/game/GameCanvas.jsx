import { useEffect, useRef, useCallback } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PIPE_SPAWN_INTERVAL } from './constants'
import { createBird, updateBird, drawBird } from './bird'
import { createPipesState, updatePipes, drawPipes, checkPipeScore } from './pipes'
import { checkCollision } from './collision'
import { getVolume } from '../audio/micInput'

export default function GameCanvas({ onDead, analyser, screamThreshold }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const rafRef = useRef(null)
  const spaceHeld = useRef(false)
  const smoothedVolRef = useRef(0)

  const initState = useCallback(() => ({
    bird: createBird(),
    pipesState: createPipesState(),
    score: 0,
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    stateRef.current = initState()
    smoothedVolRef.current = 0

    const onKeyDown = (e) => { if (e.code === 'Space') { e.preventDefault(); spaceHeld.current = true } }
    const onKeyUp = (e) => { if (e.code === 'Space') spaceHeld.current = false }
    const onPointerDown = () => { spaceHeld.current = true }
    const onPointerUp = () => { spaceHeld.current = false }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)

    function drawBackground(ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      grad.addColorStop(0, '#1a1a2e')
      grad.addColorStop(1, '#16213e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#2d5a27'
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20)
      ctx.fillStyle = '#3d7a37'
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 5)
    }

    function drawScore(ctx, score) {
      ctx.save()
      ctx.font = 'bold 52px monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.shadowColor = '#000'
      ctx.shadowBlur = 10
      ctx.fillText(score, CANVAS_WIDTH / 2, 80)
      ctx.restore()
    }

    function gameLoop(now) {
      const s = stateRef.current
      if (!s) return

      let rawVolume = 0
      if (analyser) {
        rawVolume = getVolume(analyser)
      } else if (spaceHeld.current) {
        rawVolume = 0.85
      }

      // Simple fast smoothing — matches p5.js mic.getLevel() behaviour
      smoothedVolRef.current = smoothedVolRef.current * 0.3 + rawVolume * 0.7
      const volume = smoothedVolRef.current

      updatePipes(s.pipesState, now, PIPE_SPAWN_INTERVAL)
      updateBird(s.bird, volume, now, screamThreshold)
      s.score += checkPipeScore(s.pipesState, s.bird.x)

      const hitPipe = checkCollision(s.bird, s.pipesState)
      if (hitPipe) s.bird.dead = true

      drawBackground(ctx)
      drawPipes(ctx, s.pipesState)
      drawBird(ctx, s.bird)
      drawScore(ctx, s.score)

      if (s.bird.dead) {
        cancelAnimationFrame(rafRef.current)
        setTimeout(() => onDead(s.score), 350)
        return
      }

      rafRef.current = requestAnimationFrame(gameLoop)
    }

    rafRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      stateRef.current = null
    }
  }, [initState, onDead, analyser, screamThreshold])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block', borderRadius: 12, boxShadow: '0 0 40px rgba(0,0,0,0.8)', cursor: 'none' }}
    />
  )
}
