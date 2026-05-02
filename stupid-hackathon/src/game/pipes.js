import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PIPE_WIDTH,
  PIPE_GAP,
  PIPE_SPEED,
} from './constants'

const PIPE_MIN_TOP = 60       // min height of top pipe
const PIPE_MAX_TOP = CANVAS_HEIGHT - PIPE_GAP - 80  // max height of top pipe

export function createPipesState() {
  return {
    pipes: [],
    lastSpawnTime: null,
  }
}

export function spawnPipe(pipesState, now) {
  const topHeight = PIPE_MIN_TOP + Math.random() * (PIPE_MAX_TOP - PIPE_MIN_TOP)
  pipesState.pipes.push({
    x: CANVAS_WIDTH + 10,
    topHeight,
    bottomY: topHeight + PIPE_GAP,
    passed: false,
  })
  pipesState.lastSpawnTime = now
}

export function updatePipes(pipesState, now, spawnInterval) {
  // Spawn first pipe immediately, then on interval
  if (pipesState.lastSpawnTime === null) {
    spawnPipe(pipesState, now)
    return
  }

  if (now - pipesState.lastSpawnTime >= spawnInterval) {
    spawnPipe(pipesState, now)
  }

  // Move all pipes left
  for (const pipe of pipesState.pipes) {
    pipe.x -= PIPE_SPEED
  }

  // Remove pipes that are off screen
  pipesState.pipes = pipesState.pipes.filter(p => p.x + PIPE_WIDTH > -10)
}

export function checkPipeScore(pipesState, birdX) {
  let scored = 0
  for (const pipe of pipesState.pipes) {
    if (!pipe.passed && birdX > pipe.x + PIPE_WIDTH) {
      pipe.passed = true
      scored++
    }
  }
  return scored
}

export function drawPipes(ctx, pipesState) {
  for (const pipe of pipesState.pipes) {
    drawSinglePipe(ctx, pipe)
  }
}

function drawSinglePipe(ctx, pipe) {
  const { x, topHeight, bottomY } = pipe
  const w = PIPE_WIDTH
  const capH = 24
  const capOverhang = 5

  // === Top pipe ===
  // Body
  const topGrad = ctx.createLinearGradient(x, 0, x + w, 0)
  topGrad.addColorStop(0, '#3a7d44')
  topGrad.addColorStop(0.4, '#52a85e')
  topGrad.addColorStop(1, '#2a5c33')
  ctx.fillStyle = topGrad
  ctx.fillRect(x, 0, w, topHeight - capH)

  // Cap
  const topCapGrad = ctx.createLinearGradient(x - capOverhang, 0, x + w + capOverhang, 0)
  topCapGrad.addColorStop(0, '#2d6b38')
  topCapGrad.addColorStop(0.4, '#4a9a56')
  topCapGrad.addColorStop(1, '#1f4d28')
  ctx.fillStyle = topCapGrad
  ctx.fillRect(x - capOverhang, topHeight - capH, w + capOverhang * 2, capH)

  // Cap border
  ctx.strokeStyle = '#1a3d20'
  ctx.lineWidth = 2
  ctx.strokeRect(x - capOverhang, topHeight - capH, w + capOverhang * 2, capH)

  // === Bottom pipe ===
  const botGrad = ctx.createLinearGradient(x, 0, x + w, 0)
  botGrad.addColorStop(0, '#3a7d44')
  botGrad.addColorStop(0.4, '#52a85e')
  botGrad.addColorStop(1, '#2a5c33')
  ctx.fillStyle = botGrad
  ctx.fillRect(x, bottomY + capH, w, CANVAS_HEIGHT - bottomY - capH)

  // Cap
  const botCapGrad = ctx.createLinearGradient(x - capOverhang, 0, x + w + capOverhang, 0)
  botCapGrad.addColorStop(0, '#2d6b38')
  botCapGrad.addColorStop(0.4, '#4a9a56')
  botCapGrad.addColorStop(1, '#1f4d28')
  ctx.fillStyle = botCapGrad
  ctx.fillRect(x - capOverhang, bottomY, w + capOverhang * 2, capH)

  ctx.strokeStyle = '#1a3d20'
  ctx.lineWidth = 2
  ctx.strokeRect(x - capOverhang, bottomY, w + capOverhang * 2, capH)
}
