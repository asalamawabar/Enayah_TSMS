import { useState } from 'react'
import { useAuth } from '@/store/auth'

const QUICK_LOGINS = [
  { un:'admin',     pw:'Admin@1234',  label:'مدير النظام' },
  { un:'khalid.r',  pw:'Khalid@1234', label:'مدير القطاع' },
  { un:'nora.s',    pw:'Nora@1234',   label:'المشرف' },
  { un:'faisal.sh', pw:'Faisal@1234', label:'الموظف' },
  { un:'hind.j',    pw:'Hind@1234',   label:'المراجع' },
]

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin@1234')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      const result = login(username, password)
      if (!result.ok) setError(result.error ?? 'خطأ في تسجيل الدخول')
      setLoading(false)
    }, 100)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #174F41 0%, #0F3028 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'var(--card)', borderRadius:16, padding:'40px 36px', width:420, maxWidth:'95vw', boxShadow:'0 20px 60px rgba(0,0,0,.3)' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ display:'block', margin:'0 auto 12px' }}>
            <circle cx="36" cy="36" r="34" fill="none" stroke="#1B6B5A" strokeWidth="2"/>
            <path d="M36 6 A30 30 0 0 1 36 66 A22 22 0 0 0 36 6Z" fill="#A63228"/>
            <circle cx="36" cy="18" r="7" fill="#7A7A7A"/>
            <ellipse cx="36" cy="42" rx="11" ry="14" fill="#7A7A7A"/>
          </svg>
          <div style={{ fontSize:20, fontWeight:700, color:'#1B6B5A' }}>جمعية عناية الصحية</div>
          <div style={{ fontSize:12, color:'var(--text2)', marginTop:4 }}>نظام إدارة الاشتراكات التقنية — TSMS v4.0</div>
        </div>

        {/* Form */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', fontWeight:500, marginBottom:5 }}>اسم المستخدم</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin"
            style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'Tajawal,sans-serif', color:'var(--text)', background:'var(--card)', outline:'none' }}
          />
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text2)', fontWeight:500, marginBottom:5 }}>كلمة المرور</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{ width:'100%', padding:'10px 14px', border:'1px solid var(--border)', borderRadius:8, fontSize:14, fontFamily:'Tajawal,sans-serif', color:'var(--text)', background:'var(--card)', outline:'none' }}
          />
        </div>
        {error && <div style={{ color:'#A63228', fontSize:12, marginBottom:10, textAlign:'center' }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading}
          style={{ width:'100%', padding:11, background:'#1B6B5A', color:'#fff', border:'none', borderRadius:8, fontSize:15, fontFamily:'Tajawal,sans-serif', fontWeight:500, cursor:'pointer' }}>
          {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
        </button>

        {/* Quick login */}
        <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
          <p style={{ fontSize:11, color:'var(--text2)', marginBottom:8, textAlign:'center' }}>دخول سريع حسب الدور</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
            {QUICK_LOGINS.map(u => (
              <button key={u.un} onClick={() => { setUsername(u.un); setPassword(u.pw); setTimeout(()=>login(u.un,u.pw),50) }}
                style={{ padding:'4px 10px', border:'1px solid var(--border)', borderRadius:16, fontSize:11, cursor:'pointer', background:'#E8F4F0', color:'#1B6B5A', fontFamily:'Tajawal,sans-serif' }}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
