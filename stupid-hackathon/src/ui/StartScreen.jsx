export default function StartScreen({ onStart }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, color: '#fff', fontFamily: 'monospace',
      userSelect: 'none', textAlign: 'center', padding: 24
    }}>
      <div style={{ fontSize: 72, lineHeight: 1 }}>🐦</div>
      <h1 style={{
        fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: 2,
        color: '#FFD700', textShadow: '0 0 20px #FF4444'
      }}>
        BLOW FLAP
      </h1>
      <p style={{ fontSize: 18, color: '#aaa', margin: 0 }}>
        scream to fly &nbsp;·&nbsp; silence to die
      </p>
      <div style={{
        margin: '4px 0', padding: '12px 20px', background: 'rgba(255,68,68,0.1)',
        border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8,
        fontSize: 13, color: '#ff9999', maxWidth: 280, lineHeight: 1.6
      }}>
        🎤 Mic permission required<br />
        <span style={{ color: '#666' }}>louder scream = more lift</span>
      </div>
      <button
        onClick={onStart}
        style={{
          marginTop: 8, padding: '16px 48px', fontSize: 22, fontWeight: 700,
          background: '#FF4444', color: '#fff', border: 'none', borderRadius: 8,
          cursor: 'pointer', fontFamily: 'monospace', letterSpacing: 1,
          boxShadow: '0 4px 20px rgba(255,68,68,0.5)'
        }}
      >
        START
      </button>
      <p style={{ fontSize: 12, color: '#444', margin: 0 }}>
        no mic? hold SPACE or click to flap
      </p>
    </div>
  )
}
