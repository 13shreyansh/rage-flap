import { PIPE_WIDTH, CANVAS_HEIGHT } from './constants'

// Circle vs axis-aligned rectangle collision
function circleRect(cx, cy, r, rx, ry, rw, rh) {
  const nearX = Math.max(rx, Math.min(cx, rx + rw))
  const nearY = Math.max(ry, Math.min(cy, ry + rh))
  const dx = cx - nearX
  const dy = cy - nearY
  return dx * dx + dy * dy < r * r
}

export function checkCollision(bird, pipesState) {
  const { x, y, radius } = bird
  const capOverhang = 5

  for (const pipe of pipesState.pipes) {
    const pipeLeft = pipe.x - capOverhang
    const pipeRight = pipe.x + PIPE_WIDTH + capOverhang

    // Top pipe rectangle
    if (circleRect(x, y, radius - 2, pipeLeft, 0, pipeRight - pipeLeft, pipe.topHeight)) {
      return true
    }

    // Bottom pipe rectangle
    if (circleRect(x, y, radius - 2, pipeLeft, pipe.bottomY, pipeRight - pipeLeft, CANVAS_HEIGHT - pipe.bottomY)) {
      return true
    }
  }

  return false
}
