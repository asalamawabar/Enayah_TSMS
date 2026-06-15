import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function SearchInput({ className, ...rest }: Props) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 12px', flex:1, minWidth:180 }}>
      <i className="ti ti-search" style={{ color:'var(--text3)', fontSize:15 }} />
      <input
        style={{ border:'none', background:'none', fontSize:12.5, color:'var(--text)', width:'100%', fontFamily:'Tajawal, sans-serif', outline:'none' }}
        {...rest}
      />
    </div>
  )
}
