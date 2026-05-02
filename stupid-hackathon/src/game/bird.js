import {
  BIRD_X,
  BIRD_RADIUS,
  CANVAS_HEIGHT,
} from './constants'

// === Exact shouty-flap logic scaled to our canvas ===
// Original (550x300): y += 3 fall, y -= 10 rise when vol > 0.1
// Ours (480x640): scale by 640/300 = 2.13
// Fall  = 3 * 2.13 = ~4
// Rise  = 10 * 2.13 = ~14  (net when screaming: -14+4 = -10/frame up)
const FALL  = 4    // px per frame always
const RISE  = 14   // px per frame subtracted when screaming

export function createBird() {
  return {
    x: BIRD_X,
    y: 280,
    prevY: 280,
    radius: BIRD_RADIUS,
    dead: false,
    volume: 0,
  }
}

export function updateBird(bird, smoothedVolume, now, threshold = 0.02) {
  if (bird.dead) return

  bird.prevY = bird.y
  bird.volume = smoothedVolume

  // Exact shouty-flap physics
  bird.y += FALL
  if (smoothedVolume > threshold) {
    bird.y -= RISE
  }

  // Clamp to canvas bounds
  if (bird.y - bird.radius <= 0) bird.y = bird.radius
  if (bird.y + bird.radius >= CANVAS_HEIGHT - 20) {
    bird.dead = true
  }
}

export function drawBird(ctx, bird) {
  const { x, y, prevY, radius, volume } = bird

  const dy = y - prevY  // actual movement this frame for rotation
  const angle = Math.min(Math.max(dy * 0.05, -0.4), 0.8)

  const displayThreshold = 0.02
  const rage = Math.min(Math.max((volume - displayThreshold) / 0.20, 0), 1)
  const active = volume > displayThreshold

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  // Body: yellow → orange → red with rage
  const g = Math.round(215 - rage * 215)
  if (rage > 0.25) {
    ctx.shadowColor = `rgba(255,${Math.round(100 - rage * 100)},0,${rage * 0.8})`
    ctx.shadowBlur = 10 + rage * 20
  }
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgb(255,${g},0)`
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = rage > 0.5 ? '#cc2200' : '#cc8800'
  ctx.lineWidth = 2
  ctx.stroke()

  // Eye white
  ctx.beginPath()
  ctx.arc(8, -6, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()

  // Pupil
  ctx.beginPath()
  ctx.arc(10, -5, 3.5 + rage * 2, 0, Math.PI * 2)
  ctx.fillStyle = '#111'
  ctx.fill()

  // Eyebrow
  ctx.beginPath()
  ctx.moveTo(4, -13 - rage * 3)
  ctx.lineTo(15, -10 + rage * 2)
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 2.5 + rage * 1.5
  ctx.stroke()

  // Beak
  ctx.beginPath()
  ctx.moveTo(radius - 4, -3)
  ctx.lineTo(radius + 10, 0)
  ctx.lineTo(radius - 4, 4)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()

  // Open mouth when screaming
  if (active && rage > 0.1) {
    const mouthOpen = 3 + rage * 7
    ctx.beginPath()
    ctx.arc(radius - 2, 5, mouthOpen, 0, Math.PI)
    ctx.fillStyle = '#8B0000'
    ctx.fill()
    ctx.strokeStyle = '#FF8C00'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // Wing
  const wingY = active && rage > 0.05 ? -10 - rage * 4 : 4
  ctx.beginPath()
  ctx.ellipse(-6, wingY, 10, 6, -0.4, 0, Math.PI * 2)
  ctx.fillStyle = rage > 0.5 ? '#FF6600' : '#FFA500'
  ctx.fill()

  ctx.restore()
}
