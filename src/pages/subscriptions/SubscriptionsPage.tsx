import { useState, useMemo } from 'react'
import { DB } from '@/lib/db'
import { fmtDate, fmtNum } from '@/utils/formatting'
import { StatusPill } from '@/components/ui/StatusPill'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/store/auth'

export function SubscriptionsPage() {
  const { canDo } = useAuth()
  const [q, setQ] = useState('')
  const [catF, setCatF] = useState('')
  const [statusF, setStatusF] = useState('')

  const cats = DB.query('categories').filter(c => c.status === 'نشط').sort((a,b)=>(a.order||0)-(b.order||0))
  const vendors = DB.query('vendors')
  const depts = DB.query('departments')

  const subs = useMemo(() => {
    let rows = DB.query('subscriptions')
    if (q) rows = rows.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.category.includes(q))
    if (catF) rows = rows.filter(s => s.category === catF)
    if (statusF) rows = rows.filter(s => s.status === statusF)
    return rows
  }, [q, catF, statusF])

  const total = subs.reduce((a,s) => a+s.actual_value, 0)
  const canEdit = canDo('الاشتراكات','تعديل')
  const canDel = canDo('الاشتراكات','حذف')

  function exportCSV() {
    const headers = ['رقم الاشتراك','الاشتراك','التصنيف','الحالة','تاريخ الانتهاء','التكلفة السنوية']
    const rows = subs.map(s => [s.sub_number, s.name, s.category, s.status, fmtDate(s.end_date), s.actual_value])
    const csv = [headers,...rows].map(r => r.map(c=>`"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv)
    a.download = `TSMS_subscriptions_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <SearchInput placeholder="بحث في الاشتراكات..." value={q} onChange={e=>setQ(e.target.value)} />
        <select value={catF} onChange={e=>setCatF(e.target.value)} style={{ fontFamily:'Tajawal,sans-serif', fontSize:12, border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', color:'var(--text)', background:'var(--card)' }}>
          <option value="">كل التصنيفات</option>
          {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{ fontFamily:'Tajawal,sans-serif', fontSize:12, border:'1px solid var(--border)', borderRadius:8, padding:'6px 10px', color:'var(--text)', background:'var(--card)' }}>
          <option value="">كل الحالات</option>
          {['نشط','ينتهي قريباً','منتهي','موقوف','ملغي'].map(s=><option key={s}>{s}</option>)}
        </select>
        <Button size="sm" onClick={exportCSV}><i className="ti ti-download" style={{fontSize:11}} /> CSV</Button>
      </div>

      <Card noPad>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr>{['رقم','الاشتراك','التصنيف','المورد','الإدارة','الانتهاء','السنوي (ريال)','الحالة','إجراء'].map(h=>(
                <th key={h} style={{ textAlign:'right', padding:'7px 12px', borderBottom:'1px solid var(--border)', fontSize:11, color:'var(--text2)', fontWeight:500, background:'var(--bg)', whiteSpace:'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', padding:28, color:'var(--text2)' }}>لا توجد نتائج</td></tr>
              ) : subs.map(s => {
                const v = vendors.find(x => x.id === s.vendor_id)
                const d = depts.find(x => x.id === s.dept_id)
                const isUrgent = ['ينتهي قريباً','منتهي'].includes(s.status)
                return (
                  <tr key={s.id} style={{ cursor:'default' }}>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', fontFamily:'monospace', fontSize:10.5, color:'var(--text2)' }}>{s.sub_number}</td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ fontWeight:500 }}>{s.name}</div>
                      <div style={{ fontSize:10, color:'var(--text2)' }}>{s.type}</div>
                    </td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)' }}>
                      <span style={{ background:'#E6F1FB', color:'#185FA5', padding:'2px 7px', borderRadius:8, fontSize:10.5 }}>{s.category}</span>
                    </td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', fontSize:11.5 }}>{v?.name||'—'}</td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', fontSize:11.5 }}>{d?.name?.replace('إدارة ','').replace('الإدارة ','')||'—'}</td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', color:isUrgent?'#A63228':'inherit', fontWeight:isUrgent?500:400 }}>{fmtDate(s.end_date)}</td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', fontWeight:500 }}>{fmtNum(s.actual_value)}</td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)' }}><StatusPill status={s.status} size="sm" /></td>
                    <td style={{ padding:'7px 12px', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>
                      {canEdit && <Button size="sm" style={{ marginLeft:3 }}><i className="ti ti-edit" style={{fontSize:11}} /></Button>}
                      {canDel && <Button size="sm" variant="ghost" style={{ color:'#A63228' }}><i className="ti ti-trash" style={{fontSize:11}} /></Button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11.5, color:'var(--text2)' }}>
        <span>عرض {subs.length} اشتراك</span>
        <span>إجمالي الإنفاق: <strong style={{ color:'#1B6B5A' }}>{fmtNum(total)} ريال</strong></span>
      </div>
    </div>
  )
}
