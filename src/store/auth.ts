import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrentUser } from '@/types'
import { DB, ts, addAudit } from '@/lib/db'

interface AuthState {
  user: CurrentUser | null
  login: (username: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  canDo: (screen: string, action: string) => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login(username, password) {
        if (!username || !password) return { ok: false, error: 'أدخل اسم المستخدم وكلمة المرور' }
        const users = DB.query('users')
        const user = users.find(u => (u.username === username || u.email === username) && u.password === password && !u.deleted)
        if (!user) {
          const exists = users.find(u => u.username === username || u.email === username)
          return { ok: false, error: exists ? 'كلمة المرور غير صحيحة' : 'اسم المستخدم غير موجود' }
        }
        if (user.status === 'موقوف') return { ok: false, error: 'الحساب موقوف — تواصل مع مدير النظام' }
        // Update last login directly
        const allUsers = DB.get('users').map(u => u.id === user.id ? { ...u, last_login: ts() } : u)
        DB.set('users', allUsers)
        addAudit('دخول', 'users', user.id, `تسجيل دخول: ${user.name}`, undefined, undefined, user.name)
        const role = DB.query('roles').find(r => r.id === user.role_id)
        const cu: CurrentUser = { ...user, last_login: ts(), role_name: role?.name ?? 'مستخدم' }
        set({ user: cu })
        return { ok: true }
      },

      logout() { set({ user: null }) },

      canDo(screen, action) {
        const { user } = get()
        if (!user) return false
        const perms = DB.get('permissions') as Record<number, Record<string, Record<string, 0|1>>>
        return perms[user.role_id]?.[screen]?.[action] === 1
      },
    }),
    { name: 'tsms_auth', partialize: s => ({ user: s.user }) }
  )
)
