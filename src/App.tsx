import { useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { useUI } from '@/store/ui'
import { seed } from '@/lib/seed'
import { LoginPage } from '@/pages/LoginPage'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { SubscriptionsPage } from '@/pages/subscriptions/SubscriptionsPage'
// Stub pages
import { VendorsPage } from '@/pages/vendors/VendorsPage'
import { DepartmentsPage } from '@/pages/departments/DepartmentsPage'
import { UsersPage } from '@/pages/users/UsersPage'
import { ContractsPage } from '@/pages/contracts/ContractsPage'
import { RenewalsPage } from '@/pages/renewals/RenewalsPage'
import { CancellationsPage } from '@/pages/cancellations/CancellationsPage'
import { OptimizationPage } from '@/pages/optimization/OptimizationPage'
import { InvoicesPage } from '@/pages/invoices/InvoicesPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { CalendarPage } from '@/pages/calendar/CalendarPage'
import { MasterdataPage } from '@/pages/masterdata/MasterdataPage'
import { RbacPage } from '@/pages/rbac/RbacPage'
import { AuditPage } from '@/pages/audit/AuditPage'
import { ErdPage } from '@/pages/erd/ErdPage'

const PAGES: Record<string, React.ComponentType> = {
  dash: DashboardPage, subs: SubscriptionsPage, vendors: VendorsPage,
  depts: DepartmentsPage, users: UsersPage, contracts: ContractsPage,
  renewals: RenewalsPage, cancellations: CancellationsPage,
  optimization: OptimizationPage, invoices: InvoicesPage, reports: ReportsPage,
  calendar: CalendarPage, masterdata: MasterdataPage, rbac: RbacPage,
  audit: AuditPage, erd: ErdPage,
}

export default function App() {
  const { user } = useAuth()
  const { panel, openModal } = useUI()

  useEffect(() => { seed() }, [])

  if (!user) return <LoginPage />

  const PageComponent = PAGES[panel] ?? DashboardPage

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <Topbar onAddClick={() => {
          const map: Record<string,string> = { subs:'sub', vendors:'vendor', depts:'dept', users:'user', invoices:'invoice', contracts:'contract', renewals:'renewal', cancellations:'cancellation' }
          if (map[panel]) openModal(map[panel] as never)
        }} />
        <main style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>
          <PageComponent />
        </main>
      </div>
    </div>
  )
}
