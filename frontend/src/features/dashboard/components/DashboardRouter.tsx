import { useAuth } from '@/shared/context/useAuth'
import AdminDashboard from './AdminDashboard'
import SalesDashboard from './SalesDashboard'
import FinanceDashboard from './FinanceDashboard'
import AccountantDashboard from './AccountantDashboard'

const DashboardRouter = () => {
    const { user } = useAuth()

    switch (user?.role) {
        case 'ADMIN':       return <AdminDashboard />
        case 'SALES':       return <SalesDashboard />
        case 'FINANCE':     return <FinanceDashboard />
        case 'ACCOUNTANT':  return <AccountantDashboard />
        default:            return <div>Unknown role</div>
    }
}

export default DashboardRouter