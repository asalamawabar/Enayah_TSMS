interface Props {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down'
  accent?: string
  icon?: string
}

export function KpiCard({ label, value, sub, trend, accent = '#1B6B5A', icon }: Props) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: accent }} />
      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <i className={`ti ti-${icon}`} />} {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: trend ? (trend === 'up' ? '#0F6E56' : '#A63228') : 'var(--text2)', marginTop: 4 }}>{trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}{sub}</div>}
    </div>
  )
}
