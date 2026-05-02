import { useEffect, useState } from 'react'

export default function CalibrationScreen() {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const t2 = setTimeout(() => setCount(2), 333)
    const t1 = setTimeout(() => setCount(1), 666)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, fontFamily: 'monospace',
      color: '#fff', textAlign: 'center'
    }}>
      <div style={{ fontSize: 36, color: '#888' }}>🔇 stay quiet...</div>
      <div style={{
        fontSize: 120, fontWeight: 900, lineHeight: 1,
        color: '#FFD700', textShadow: '0 0 30px rgba(255,215,0,0.5)',
        transition: 'all 0.15s ease'
      }}>
        {count}
      </div>
      <div style={{ fontSize: 14, color: '#555' }}>
        measuring room noise
      </div>
    </div>
  )
}
