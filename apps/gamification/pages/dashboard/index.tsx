import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { DashboardQuests } from 'views/DashboardQuests/index'

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardQuests />
    </DashboardLayout>
  )
}

export default DashboardPage
