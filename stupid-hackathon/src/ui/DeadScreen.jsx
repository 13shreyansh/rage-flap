const MESSAGES = [
  'Incredible silence.',
  'Birds cannot scream. You proved nothing.',
  'Your ancestors are disappointed.',
  'Almost. Not really.',
  'The pipes were not at fault.',
  'A valiant effort. Mostly valiant.',
  'You had one job.',
  'The bird screamed. You did not.',
  'Next time, use your lungs.',
]

export default function DeadScreen({ score, onRestart, micError }) {
  const msg = MESSAGES[score % MESSAGES.length]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, color: '#fff', fontFamily: 'monospace',
      userSelect: 'none', textAlign: 'center', padding: 24
    }}>
      <div style={{ fontSize: 64 }}>💀</div>
      <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: '#FF4444' }}>DEAD</h1>
      <p style={{ fontSize: 24, margin: 0, color: '#FFD700' }}>Score: {score}</p>
      <p style={{ fontSize: 15, color: '#aaa', margin: 0, maxWidth: 280, lineHeight: 1.6 }}>{msg}</p>
      {micError && (
        <p style={{ fontSize: 12, color: '#FF4444', maxWidth: 280 }}>{micError}</p>
      )}
      <button
        onClick={onRestart}
        style={{
          marginTop: 8, padding: '14px 40px', fontSize: 20, fontWeight: 700,
          background: '#FF4444', color: '#fff', border: 'none', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 1,
          boxShadow: '0 4px 20px rgba(255,68,68,0.5)'
        }}
      >
        TRY AGAIN
      </button>
    </div>
  )
}
