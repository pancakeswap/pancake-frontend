import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { DashboardQuests } from 'views/DashboardQuests/index'

const DashboardPage = () => {
  return <DashboardQuests />
}

DashboardPage.Layout = DashboardLayout

export default DashboardPage
