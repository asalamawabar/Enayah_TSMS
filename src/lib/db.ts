// ─────────────────────────────────────────────
//  TSMS — Database Engine (localStorage)
//  Drop-in TypeScript port of the HTML version
// ─────────────────────────────────────────────
import type { DBSchema } from '@/types'

const PREFIX = 'tsms4_'

type TableKey = keyof DBSchema
type TableRow<T extends TableKey> = DBSchema[T] extends (infer R)[] ? R : DBSchema[T]

export const DB = {
  _k: (t: string) => PREFIX + t,

  get<T extends TableKey>(table: T): DBSchema[T] {
    try {
      return JSON.parse(localStorage.getItem(DB._k(table)) ?? '[]') as DBSchema[T]
    } catch {
      return [] as unknown as DBSchema[T]
    }
  },

  set<T extends TableKey>(table: T, data: DBSchema[T]): void {
    localStorage.setItem(DB._k(table), JSON.stringify(data))
  },

  nextId<T extends TableKey>(table: T): number {
    const rows = DB.get(table) as Array<{ id: number }>
    return rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1
  },

  query<T extends TableKey>(
    table: T,
    filter?: Partial<TableRow<T>>
  ): Array<TableRow<T>> {
    const rows = DB.get(table) as Array<TableRow<T> & { deleted?: boolean }>
    return rows.filter(r => {
      if (r.deleted) return false
      if (!filter) return true
      return Object.entries(filter).every(([k, v]) => (r as Record<string, unknown>)[k] === v)
    })
  },

  insert<T extends TableKey>(
    table: T,
    row: Omit<TableRow<T>, 'id' | 'deleted' | 'created_at' | 'updated_at'>
  ): TableRow<T> {
    const rows = DB.get(table) as Array<TableRow<T>>
    const now = ts()
    const newRow = {
      ...row,
      id: DB.nextId(table),
      deleted: false,
      created_at: now,
      updated_at: now,
    } as TableRow<T>
    rows.push(newRow)
    DB.set(table, rows as DBSchema[T])
    return newRow
  },

  update<T extends TableKey>(
    table: T,
    id: number,
    changes: Partial<TableRow<T>>
  ): TableRow<T> | undefined {
    const rows = DB.get(table) as Array<TableRow<T> & { id: number; updated_at?: string }>
    const updated = rows.map(r =>
      r.id === id ? { ...r, ...changes, updated_at: ts() } : r
    )
    DB.set(table, updated as unknown as DBSchema[T])
    return updated.find(r => r.id === id)
  },

  softDelete<T extends TableKey>(table: T, id: number): void {
    DB.update(table, id, { deleted: true } as Partial<TableRow<T>>)
  },
}

// ── Formatting helpers ──
export function ts(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}

export function fmtDate(d?: string | null): string {
  if (!d) return '—'
  if (d.includes('/')) return d
  const parts = d.split('-')
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
  return d
}

export function fmtNum(n?: number | null): string {
  if (n == null || isNaN(n)) return '0'
  return Number(n).toLocaleString('en-US')
}

export function fmt(n?: number | null): string {
  if (n == null || isNaN(n)) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return Math.round(n / 1_000) + 'K'
  return Math.round(n).toLocaleString('en-US')
}

// ── Audit helper ──
export function addAudit(
  action: string,
  tableName: string,
  recordId: number,
  description: string,
  oldValues?: unknown,
  newValues?: unknown,
  userName?: string
): void {
  const logs = DB.get('audit') as Array<{ id: number } & Record<string, unknown>>
  logs.unshift({
    id: logs.length ? logs[0].id + 1 : 1,
    action, table_name: tableName, record_id: recordId,
    description, user: userName ?? 'النظام', created_at: ts(), deleted: false,
    old_values: oldValues ? JSON.stringify(oldValues) : null,
    new_values: newValues ? JSON.stringify(newValues) : null,
  })
  if (logs.length > 500) logs.length = 500
  DB.set('audit', logs as DBSchema['audit'])
}
