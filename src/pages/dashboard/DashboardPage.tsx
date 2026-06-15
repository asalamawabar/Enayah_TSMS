import { useMemo } from 'react'
import { DB } from '@/lib/db'
import { fmt, fmtDate, fmtNum } from '@/utils/formatting'
import { checkSmartAlerts } from '@/utils/alerts'
import { KpiCard } from '@/components/ui/KpiCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusPill } from '@/components/ui/StatusPill'
import { useUI } from '@/store/ui'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, LineElement, PointElement } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, LineElement, PointElement)

export function DashboardPage() {
  const { setPanel } = useUI()
  const subs = DB.query('subscriptions')
  const opts = DB.query('optimization')
  const periods = DB.get('subscription_periods').filter((p: {deleted?:boolean}) => !p.deleted)
  const renewals = DB.query('renewals')
  const alerts = checkSmartAlerts()

  const stats = useMemo(() => {
    const active = subs.filter(s => s.status === 'نشط').length
    const expiring = subs.filter(s => s.status === 'ينتهي قريباً').length
    const expired = subs.filter(s => s.status === 'منتهي').length
    const cancelled = subs.filter(s => s.status === 'ملغي').length
    const totalAnnual = subs.reduce((a,s) => a+s.actual_value, 0)
    const totalMarket = subs.reduce((a,s) => a+s.market_value, 0)
    const savings = totalMarket - totalAnnual
    const eligibleOpt = opts.filter(o => o.eligible === 'نعم').length
    const optSaving = opts.reduce((a,o) => a + (o.expected_saving||0), 0)
    const historicalSpend = (periods as Array<{actual_value:number}>).reduce((a,p) => a+p.actual_value, 0)
    const pendingRen = renewals.filter(r => ['مراجعة تقنية','اعتماد مالي'].includes(r.status)).length
    const expiringVal = subs.filter(s => s.status === 'ينتهي قريباً').reduce((a,s) => a+s.actual_value, 0)
    return { active, expiring, expired, cancelled, totalAnnual, savings, totalMarket, eligibleOpt, optSaving, historicalSpend, pendingRen, expiringVal }
  }, [subs, opts, periods, renewals])

  // Category chart
  const byCategory: Record<string, number> = {}
  subs.forEach(s => { byCategory[s.category] = (byCategory[s.category]||0)+1 })
  const catLabels = Object.keys(byCategory)
  const catColors = ['#1B6B5A','#185FA5','#BA7517','#A63228','#534AB7','#6B7280','#0F6E56','#D85A30']

  // Vendor spend bars
  const vendors = DB.query('vendors')
  const vSpend: Record<number, number> = {}
  subs.forEach(s => { if (s.vendor_id) vSpend[s.vendor_id] = (vSpend[s.vendor_id]||0)+s.actual_value })
  const topVendors = Object.entries(vSpend).sort((a,b) => b[1]-a[1]).slice(0,6)

  // Monthly spend (simulated from total)
  const base = Math.round(stats.totalAnnual/12/1000)
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو']
  const spendData = months.map((_,i) => Math.max(1, base + Math.round((Math.sin(i)*0.15)*base)))

  const expList = subs.filter(s => ['ينتهي قريباً','منتهي'].includes(s.status)).slice(0,6)

  return (
    <div>
      {alerts.length > 0 && (
        <div style={{ background:'#F5ECEA', border:'1px solid rgba(166,50,40,.25)', borderRadius:8, padding:'9px 14px', display:'flex', alignItems:'center', gap:10, marginBottom:16, fontSize:12 }}>
          <i className="ti ti-alert-triangle" style={{ color:'#A63228', fontSize:16, flexShrink:0 }} />
          <span style={{ color:'#A63228', flex:1 }}>تنبيه: {alerts.length} اشتراك ينتهي قريباً ويحتاج مراجعة</span>
          <button onClick={() => setPanel('subs')} style={{ fontSize:11, color:'#A63228', border:'1px solid rgba(166,50,40,.3)', borderRadius:5, padding:'2px 8px', background:'none', cursor:'pointer' }}>مراجعة الاشتراكات</button>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px,1fr))', gap:10, marginBottom:18 }}>
        <KpiCard label="إجمالي الاشتراكات" value={subs.length} sub="مسجلة في النظام" icon="certificate" />
        <KpiCard label="الاشتراكات النشطة" value={stats.active} sub={`${Math.round(stats.active/Math.max(subs.length,1)*100)}% من الإجمالي`} accent="#185FA5" icon="circle-check" />
        <KpiCard label="تنتهي قريباً" value={stats.expiring} sub="تحتاج مراجعة" trend={stats.expiring>0?'down':undefined} accent="#BA7517" icon="clock" />
        <KpiCard label="منتهية" value={stats.expired} sub="إجراء مطلوب" accent="#A63228" icon="circle-x" />
        <KpiCard label="ملغاة" value={stats.cancelled} sub={fmtNum(subs.filter(s=>s.status==='ملغي').reduce((a,s)=>a+s.actual_value,0))+' ريال'} accent="#6B7280" icon="ban" />
        <KpiCard label="الإنفاق السنوي" value={fmt(stats.totalAnnual)} sub="ريال سعودي" accent="#C8A84B" icon="coin" />
        <KpiCard label="الوفورات المحققة" value={fmt(stats.savings)} sub={`${Math.round(stats.savings/Math.max(stats.totalMarket,1)*100)}% وفر`} trend="up" accent="#0F6E56" icon="trending-down" />
        <KpiCard label="قابلة للترشيد" value={stats.eligibleOpt} sub={`وفر متوقع ${fmt(stats.optSaving)} ريال`} accent="#BA7517" icon="leaf" />
        {stats.pendingRen > 0 && <KpiCard label="تجديدات معلقة" value={stats.pendingRen} sub="تحتاج اعتماد" trend="down" accent="#A63228" icon="refresh" />}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        <Card>
          <CardHeader title="اتجاه الإنفاق الشهري (ألف ريال)" />
          <div style={{ height:180 }}>
            <Bar data={{ labels:months, datasets:[
              { label:'الفعلي', data:spendData, backgroundColor:'#1B6B5A', borderRadius:4 },
              { label:'المخطط', type:'line' as const, data:Array(6).fill(base), borderColor:'#BA7517', borderDash:[4,3], pointRadius:0, fill:false, borderWidth:1.5, tension:0 }
            ]}} options={{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false},ticks:{font:{size:10}}}, y:{ticks:{callback:(v:unknown) => v+'K', font:{size:10}}} } }} />
          </div>
        </Card>
        <Card>
          <CardHeader title="توزيع حسب التصنيف" />
          <div style={{ height:150 }}>
            <Doughnut data={{ labels:catLabels, datasets:[{ data:Object.values(byCategory), backgroundColor:catColors.slice(0,catLabels.length), borderWidth:2, borderColor:'#fff' }]}} options={{ responsive:true, maintainAspectRatio:false, cutout:'62%', plugins:{legend:{display:false}} }} />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
            {catLabels.map((l,i) => <span key={l} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, color:'var(--text2)' }}><span style={{ width:8, height:8, borderRadius:2, background:catColors[i], display:'inline-block' }} />{l}</span>)}
          </div>
        </Card>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Top vendors */}
        <Card>
          <CardHeader title="أعلى الموردين إنفاقاً" />
          {topVendors.map(([vid, sp], i) => {
            const v = vendors.find(x => x.id === parseInt(vid))
            const pct = Math.round(sp/(topVendors[0]?.[1]??1)*100)
            return (
              <div key={vid} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:12 }}>
                <div style={{ width:90, color:'var(--text)', fontSize:11.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v?.name||'مجهول'}</div>
                <div style={{ flex:1, height:5, background:'var(--bg)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:catColors[i], borderRadius:3 }} />
                </div>
                <div style={{ fontSize:11, color:'var(--text2)', minWidth:45, textAlign:'left' }}>{fmt(sp)}</div>
              </div>
            )
          })}
          <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, color:'var(--text2)', marginBottom:4 }}>إجمالي الإنفاق التاريخي</div>
            <div style={{ fontSize:18, fontWeight:500, color:'#1B6B5A' }}>{fmtNum(stats.historicalSpend)} ريال</div>
          </div>
        </Card>

        {/* Expiry list */}
        <Card>
          <CardHeader title="الاشتراكات قريبة الانتهاء" action={<button onClick={() => setPanel('subs')} style={{ fontSize:11, color:'#1B6B5A', background:'none', border:'none', cursor:'pointer' }}>الكل</button>} />
          {stats.expiringVal > 0 && (
            <div style={{ background:'#FAEEDA', border:'1px solid rgba(186,117,23,.2)', borderRadius:8, padding:'7px 12px', marginBottom:10, display:'flex', justifyContent:'space-between', fontSize:12 }}>
              <span style={{ color:'#BA7517' }}>إجمالي قيمة الاشتراكات قريبة الانتهاء</span>
              <strong style={{ color:'#BA7517' }}>{fmtNum(stats.expiringVal)} ريال</strong>
            </div>
          )}
          {expList.length === 0 ? (
            <div style={{ textAlign:'center', color:'var(--text2)', fontSize:12, padding:'20px 0' }}>✅ لا توجد اشتراكات منتهية</div>
          ) : expList.map(s => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:s.status==='منتهي'?'#A63228':'#BA7517', flexShrink:0 }} />
              <div style={{ flex:1, fontSize:12, fontWeight:500, color:'var(--text)' }}>{s.name}</div>
              <div style={{ fontSize:10.5, color:'var(--text2)' }}>{fmtDate(s.end_date)}</div>
              <StatusPill status={s.status} size="sm" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
