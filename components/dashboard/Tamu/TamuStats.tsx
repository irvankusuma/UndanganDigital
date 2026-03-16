'use client'

interface TamuStatsProps {
  totalCount: number
  rsvpCount: number
}

export function TamuStats({ totalCount, rsvpCount }: TamuStatsProps) {
  const stats = [
    { label: 'TOTAL TAMU', value: totalCount, sub: 'Orang', color: '#1a1a1a' },
    { label: 'KONFIRMASI HADIR', value: rsvpCount, sub: `Orang (${totalCount > 0 ? Math.round(rsvpCount / totalCount * 100) : 0}%)`, color: '#E8627A' },
    { label: 'KAPASITAS MAKSIMAL', value: 500, sub: 'Orang', color: '#888' },
  ]

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      {stats.map(s => (
        <div key={s.label} style={{
          flex: '1 1 180px', background: 'white', borderRadius: 14, padding: '20px 22px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0',
        }}>
          <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>{s.label}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value} <span style={{ fontSize: 14, fontWeight: 400, color: '#aaa' }}>{s.sub}</span></div>
        </div>
      ))}
    </div>
  )
}
