import { DB } from '@/lib/db'
import { daysUntil, alertThreshold } from './formatting'
import type { Subscription } from '@/types'

export interface AlertItem {
  sub: Subscription
  days: number
  threshold: number
  level: 'critical' | 'warning' | 'info'
}

export function checkSmartAlerts(): AlertItem[] {
  const subs = DB.query('subscriptions')
  const alerts: AlertItem[] = []
  subs.forEach(s => {
    if (!s.end_date) return
    const days = daysUntil(s.end_date)
    const threshold = alertThreshold(s.billing_cycle)
    if (days <= threshold && days >= 0) {
      alerts.push({
        sub: s, days, threshold,
        level: days <= 7 ? 'critical' : days <= 15 ? 'warning' : 'info'
      })
    }
  })
  return alerts.sort((a, b) => a.days - b.days)
}
