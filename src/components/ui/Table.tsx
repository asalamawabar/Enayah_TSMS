import type { ReactNode } from 'react'
import clsx from 'clsx'

interface Col<T> { key: string; label: string; render?: (row: T) => ReactNode; width?: string; mono?: boolean }

interface Props<T> { cols: Col<T>[]; rows: T[]; empty?: string; onRowHover?: boolean }

export function Table<T extends Record<string, unknown>>({ cols, rows, empty = 'لا توجد نتائج', onRowHover = true }: Props<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{ textAlign: 'right', padding: '7px 12px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text2)', fontWeight: 500, background: 'var(--bg)', whiteSpace: 'nowrap', width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ textAlign: 'center', padding: 28, color: 'var(--text2)', fontSize: 13 }}>{empty}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className={clsx(onRowHover && 'table-row-hover')}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: '7px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text)', verticalAlign: 'middle', fontFamily: c.mono ? 'monospace' : undefined, fontSize: c.mono ? 11 : undefined }}>
                  {c.render ? c.render(row) : String(row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
