import { statusPill } from '@/utils/formatting'

interface Props { status: string; size?: 'sm' | 'md' }

export function StatusPill({ status, size = 'md' }: Props) {
  const { bg, text } = statusPill(status)
  const px = size === 'sm' ? '5px' : '8px'
  const py = size === 'sm' ? '1px' : '2px'
  return (
    <span style={{ background: bg, color: text, padding: `${py} ${px}`, borderRadius: 8, fontSize: size === 'sm' ? 10 : 11, fontWeight: 500, display:'inline-flex', alignItems:'center', gap: 3, whiteSpace:'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {status}
    </span>
  )
}
