import type { ReactNode, CSSProperties } from 'react'

interface Props { children: ReactNode; style?: CSSProperties; noPad?: boolean }

export function Card({ children, style, noPad }: Props) {
  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding: noPad ? 0 : '14px 18px', boxShadow:'0 1px 3px rgba(0,0,0,.06)', overflow: noPad ? 'hidden' : undefined, ...style }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
      <span style={{ fontSize:13, fontWeight:500, color:'var(--text)' }}>{title}</span>
      {action}
    </div>
  )
}
