import { useUI } from '@/store/ui'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { checkSmartAlerts } from '@/utils/alerts'
import { dbExport, dbImport } from '@/lib/persistence'

const PAGE_INFO: Record<string, { title: string; crumb: string; screen?: string; addLabel?: string }> = {
  dash:          { title:'لوحة المعلومات', crumb:'الرئيسية / نظرة عامة' },
  subs:          { title:'إدارة الاشتراكات', crumb:'الرئيسية / الاشتراكات', screen:'الاشتراكات', addLabel:'اشتراك جديد' },
  vendors:       { title:'إدارة الموردين', crumb:'الرئيسية / الموردون', screen:'الموردون', addLabel:'مورد جديد' },
  depts:         { title:'الإدارات المستفيدة', crumb:'الرئيسية / الإدارات', screen:'الإدارات', addLabel:'إدارة جديدة' },
  invoices:      { title:'الفواتير', crumb:'الرئيسية / الفواتير', screen:'الفواتير', addLabel:'فاتورة جديدة' },
  reports:       { title:'التقارير', crumb:'الرئيسية / التقارير' },
  users:         { title:'إدارة المستخدمين', crumb:'الرئيسية / المستخدمون', screen:'المستخدمون', addLabel:'مستخدم جديد' },
  rbac:          { title:'الصلاحيات RBAC', crumb:'الرئيسية / الصلاحيات' },
  erd:           { title:'مخطط قاعدة البيانات', crumb:'الرئيسية / ERD' },
  audit:         { title:'سجل العمليات', crumb:'الرئيسية / Audit Log' },
  contracts:     { title:'إدارة العقود', crumb:'الرئيسية / العقود', screen:'الاشتراكات', addLabel:'عقد جديد' },
  renewals:      { title:'طلبات التجديد', crumb:'الرئيسية / التجديدات', screen:'الاشتراكات', addLabel:'طلب تجديد' },
  cancellations: { title:'طلبات الإلغاء', crumb:'الرئيسية / الإلغاءات', screen:'الاشتراكات', addLabel:'طلب إلغاء' },
  optimization:  { title:'الترشيد والوفورات', crumb:'الرئيسية / الترشيد' },
  calendar:      { title:'التقويم', crumb:'الرئيسية / التقويم' },
  masterdata:    { title:'البيانات المرجعية', crumb:'الرئيسية / الإعدادات' },
}

interface Props { onAddClick: () => void }

export function Topbar({ onAddClick }: Props) {
  const { panel } = useUI()
  const { canDo } = useAuth()
  const info = PAGE_INFO[panel] ?? { title: panel, crumb: '' }
  const alerts = checkSmartAlerts()
  const canAdd = info.screen && info.addLabel && canDo(info.screen, 'إضافة')

  return (
    <header style={{ background:'var(--card)', borderBottom:'1px solid var(--border)', padding:'0 20px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:500, color:'var(--text)' }}>{info.title}</div>
        <div style={{ fontSize:11, color:'var(--text2)' }}>{info.crumb}</div>
      </div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        {/* DB save indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#E8F4F0', border:'1px solid rgba(27,107,90,.2)', borderRadius:8, padding:'4px 10px' }}>
          <i className="ti ti-database" style={{ color:'#1B6B5A', fontSize:13 }} />
          <span style={{ fontSize:11, color:'#1B6B5A' }}>قاعدة البيانات نشطة</span>
          <Button size="sm" variant="primary" onClick={dbExport}>
            <i className="ti ti-cloud-download" style={{fontSize:11}} /> حفظ
          </Button>
          <label style={{ cursor:'pointer' }}>
            <Button size="sm" as="span"><i className="ti ti-cloud-upload" style={{fontSize:11}} /> استعادة</Button>
            <input type="file" accept=".json" style={{ display:'none' }} onChange={e => e.target.files?.[0] && dbImport(e.target.files[0])} />
          </label>
        </div>
        {/* Alert bell */}
        <button style={{ position:'relative', background:'none', border:'1px solid var(--border)', borderRadius:8, padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text2)' }}>
          <i className="ti ti-bell" />
          {alerts.length > 0 && (
            <span style={{ background:'#A63228', color:'#fff', borderRadius:8, fontSize:9, padding:'1px 5px' }}>{alerts.length}</span>
          )}
        </button>
        {canAdd && (
          <Button variant="primary" onClick={onAddClick}>
            <i className="ti ti-plus" style={{fontSize:13}} /> {info.addLabel}
          </Button>
        )}
      </div>
    </header>
  )
}
