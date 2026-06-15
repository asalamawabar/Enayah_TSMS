import { useUI } from '@/store/ui'
import { useAuth } from '@/store/auth'
import type { NavPanel } from '@/types'
import { DB } from '@/lib/db'

const NAV: Array<{ panel: NavPanel; label: string; icon: string; group?: string; badge?: string }> = [
  { group: 'الرئيسية', panel: 'dash', label: 'لوحة المعلومات', icon: 'layout-dashboard' },
  { group: 'إدارة الاشتراكات', panel: 'subs', label: 'الاشتراكات', icon: 'certificate', badge: 'subs' },
  { panel: 'vendors', label: 'الموردون', icon: 'building-store' },
  { panel: 'depts', label: 'الإدارات المستفيدة', icon: 'building' },
  { group: 'الاشتراكات والعقود', panel: 'contracts', label: 'العقود', icon: 'file-description' },
  { panel: 'renewals', label: 'طلبات التجديد', icon: 'refresh', badge: 'renewals' },
  { panel: 'cancellations', label: 'طلبات الإلغاء', icon: 'ban' },
  { panel: 'optimization', label: 'الترشيد والوفورات', icon: 'trending-down' },
  { group: 'المالية والتقارير', panel: 'invoices', label: 'الفواتير', icon: 'file-invoice' },
  { panel: 'reports', label: 'التقارير', icon: 'chart-bar' },
  { panel: 'calendar', label: 'التقويم', icon: 'calendar' },
  { group: 'النظام', panel: 'users', label: 'المستخدمون', icon: 'users' },
  { panel: 'rbac', label: 'الصلاحيات RBAC', icon: 'shield-lock' },
  { panel: 'masterdata', label: 'البيانات المرجعية', icon: 'settings-2' },
  { panel: 'erd', label: 'مخطط قاعدة البيانات', icon: 'database' },
  { panel: 'audit', label: 'سجل العمليات', icon: 'list-check' },
]

export function Sidebar() {
  const { panel, setPanel, sidebarCollapsed, toggleSidebar } = useUI()
  const { user, logout } = useAuth()

  const subsCount = DB.query('subscriptions').length
  const renewalCount = DB.query('renewals').filter(r => ['مراجعة تقنية','اعتماد مالي'].includes(r.status)).length

  const getBadge = (b?: string) => {
    if (b === 'subs') return subsCount || null
    if (b === 'renewals') return renewalCount || null
    return null
  }

  return (
    <aside style={{ width: sidebarCollapsed ? 56 : 230, background:'#174F41', display:'flex', flexDirection:'column', flexShrink:0, transition:'width .2s', overflow:'hidden' }}>
      {/* Logo */}
      <div style={{ padding:14, borderBottom:'1px solid rgba(255,255,255,.1)', display:'flex', alignItems:'center', gap:10 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink:0 }}>
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1"/>
          <path d="M18 4 A13 13 0 0 1 18 32 A9 9 0 0 0 18 4Z" fill="#A63228"/>
          <circle cx="18" cy="10" r="3.5" fill="#9CA3AF"/>
          <ellipse cx="18" cy="22" rx="5" ry="6" fill="#9CA3AF"/>
        </svg>
        {!sidebarCollapsed && (
          <div>
            <div style={{ fontSize:12, color:'#fff', fontWeight:500 }}>عناية الصحية — TSMS</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.45)' }}>React v4.0</div>
          </div>
        )}
        <button onClick={toggleSidebar} style={{ marginRight:'auto', background:'none', border:'none', color:'rgba(255,255,255,.5)', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center' }}>
          <i className="ti ti-menu-2" />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {NAV.map((item, idx) => (
          <div key={idx}>
            {item.group && !sidebarCollapsed && (
              <div style={{ fontSize:9, color:'rgba(255,255,255,.3)', padding:'8px 13px 3px', letterSpacing:'.06em' }}>
                {item.group}
              </div>
            )}
            <button
              onClick={() => setPanel(item.panel)}
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:9, padding:'8px 13px',
                fontSize:12.5, color: panel === item.panel ? '#fff' : 'rgba(255,255,255,.65)',
                background: panel === item.panel ? 'rgba(255,255,255,.11)' : 'none',
                border: 'none', borderRight: panel === item.panel ? '3px solid #C8A84B' : '3px solid transparent',
                cursor:'pointer', transition:'all .1s', textAlign:'right', fontFamily:'Tajawal, sans-serif',
                whiteSpace:'nowrap', overflow:'hidden',
              }}
            >
              <i className={`ti ti-${item.icon}`} style={{ fontSize:16, flexShrink:0, width:18, textAlign:'center' }} />
              {!sidebarCollapsed && <span style={{ flex:1, textAlign:'right' }}>{item.label}</span>}
              {!sidebarCollapsed && getBadge(item.badge) != null && (
                <span style={{ background:'#A63228', color:'#fff', borderRadius:8, fontSize:9, padding:'1px 6px', flexShrink:0 }}>
                  {getBadge(item.badge)}
                </span>
              )}
            </button>
          </div>
        ))}
        <button
          onClick={logout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'8px 13px', fontSize:12.5, color:'rgba(255,255,255,.65)', background:'none', border:'none', borderTop:'1px solid rgba(255,255,255,.08)', cursor:'pointer', fontFamily:'Tajawal, sans-serif', marginTop:8 }}
        >
          <i className="ti ti-logout" style={{ fontSize:16, flexShrink:0, width:18 }} />
          {!sidebarCollapsed && 'تسجيل الخروج'}
        </button>
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && user && (
        <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'#2A8A72', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:500, flexShrink:0 }}>
              {user.avatar}
            </div>
            <div>
              <div style={{ fontSize:11.5, color:'#fff' }}>{user.name}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.45)' }}>{user.role_name}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
