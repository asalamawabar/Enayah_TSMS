export { fmtDate, fmtNum, fmt, ts } from '@/lib/db'

export function getFileIcon(name: string): string {
  const ext = (name ?? '').split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = { pdf:'file-type-pdf', docx:'file-type-docx', doc:'file-word', xlsx:'file-type-xls', jpg:'photo', jpeg:'photo', png:'photo' }
  return map[ext] ?? 'paperclip'
}

export function formatBytes(b: number): string {
  return b > 1_048_576 ? (b/1_048_576).toFixed(1)+' MB' : b > 1024 ? (b/1024).toFixed(0)+' KB' : b+' B'
}

export function statusPill(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    'نشط':           { bg: '#E8F4F0', text: '#1B6B5A' },
    'ينتهي قريباً':  { bg: '#FAEEDA', text: '#854F0B' },
    'منتهي':         { bg: '#F5ECEA', text: '#A63228' },
    'موقوف':         { bg: '#F3F4F6', text: '#6B7280' },
    'ملغي':          { bg: '#F3F4F6', text: '#6B7280' },
    'مسودة':         { bg: '#F3F4F6', text: '#6B7280' },
    'مراجعة تقنية': { bg: '#E6F1FB', text: '#185FA5' },
    'اعتماد مالي':  { bg: '#FAEEDA', text: '#854F0B' },
    'معتمد':         { bg: '#E8F4F0', text: '#1B6B5A' },
    'مرفوض':         { bg: '#F5ECEA', text: '#A63228' },
    'مدفوعة':        { bg: '#E8F4F0', text: '#1B6B5A' },
    'معلقة':         { bg: '#FAEEDA', text: '#854F0B' },
    'متأخرة':        { bg: '#F5ECEA', text: '#A63228' },
    'ملغاة':         { bg: '#F3F4F6', text: '#6B7280' },
  }
  return map[status] ?? { bg: '#F3F4F6', text: '#6B7280' }
}

export function daysUntil(dateStr: string): number {
  const end = new Date(dateStr)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function alertThreshold(billingCycle: string): number {
  if (billingCycle === 'شهري') return 7
  if (billingCycle === 'ربع سنوي') return 15
  return 30
}
