// DB Export / Import (localStorage backup)
import { DB, ts, addAudit } from './db'
import type { DBSchema } from '@/types'

const DB_TABLES = Object.keys({} as DBSchema) as Array<keyof DBSchema>
const ALL_TABLES: Array<keyof DBSchema> = [
  'subscriptions','subscription_periods','vendors','departments','users','roles',
  'categories','permissions','invoices','audit','seeded','contracts','renewals',
  'cancellations','optimization','sub_types','countries','contract_types',
  'cancel_reasons','opt_reasons','attach_types','notifications','attachments',
  'renewal_history','cancellation_history',
]

export function dbExport(userName?: string): void {
  const snap: Record<string, unknown> = {
    _meta: { system:'TSMS — جمعية عناية الصحية', version:'4.0', exported_at: new Date().toISOString(), exported_by: userName ?? 'مجهول' }
  }
  ALL_TABLES.forEach(t => { snap[t] = localStorage.getItem('tsms4_'+t) ? JSON.parse(localStorage.getItem('tsms4_'+t)!) : [] })
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type:'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `TSMS_Backup_${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
  addAudit('تصدير','database',0,'نسخة احتياطية كاملة')
}

export function dbImport(file: File): void {
  if (!file.name.endsWith('.json')) { alert('يجب اختيار ملف JSON'); return }
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (!data._meta?.system?.includes('TSMS')) { alert('الملف ليس نسخة TSMS صحيحة'); return }
      const ok = confirm(`استعادة قاعدة البيانات؟\nتاريخ النسخة: ${new Date(data._meta.exported_at).toLocaleDateString('en-GB')}\nبواسطة: ${data._meta.exported_by}`)
      if (!ok) return
      let restored = 0
      ALL_TABLES.forEach(t => { if (data[t] !== undefined) { localStorage.setItem('tsms4_'+t, JSON.stringify(data[t])); restored++ } })
      alert(`✅ تم استعادة ${restored} جداول — ستُعاد تحديث الصفحة`)
      window.location.reload()
    } catch { alert('خطأ في قراءة الملف') }
  }
  reader.readAsText(file, 'UTF-8')
}
