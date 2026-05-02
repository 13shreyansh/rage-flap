export async function setupMic() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,   // don't remove echo — we want raw sound
      noiseSuppression: false,   // don't filter noise — calibration handles it
      autoGainControl: false,    // CRITICAL: don't let browser normalize volume
    },
    video: false,
  })
  const audioCtx = new AudioContext()
  const source = audioCtx.createMediaStreamSource(stream)
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 1024
  analyser.smoothingTimeConstant = 0.3 // light smoothing at analyser level
  source.connect(analyser)
  return { analyser, audioCtx, stream }
}

// RMS volume — correct way to measure loudness from a waveform
// Returns 0.0–1.0 (typically 0.0–0.5 in practice)
export function getVolume(analyser) {
  const data = new Float32Array(analyser.fftSize)
  analyser.getFloatTimeDomainData(data)
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i]
  }
  return Math.sqrt(sum / data.length)
}

// Measure ambient room noise baseline
export function calibrateBaseline(analyser, durationMs = 1000) {
  return new Promise((resolve) => {
    const samples = []
    const id = setInterval(() => samples.push(getVolume(analyser)), 40)
    setTimeout(() => {
      clearInterval(id)
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length
      resolve(avg)
    }, durationMs)
  })
}

export function teardownMic({ audioCtx, stream }) {
  stream.getTracks().forEach(t => t.stop())
  audioCtx.close()
}
