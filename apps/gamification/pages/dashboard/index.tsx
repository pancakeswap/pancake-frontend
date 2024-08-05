import { SUPPORTED_CHAIN } from 'config/supportedChain'
import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { DashboardQuests } from 'views/DashboardQuests/index'

const DashboardPage = () => {
  return <DashboardQuests />
}

DashboardPage.chains = SUPPORTED_CHAIN
DashboardPage.Layout = DashboardLayout

export default DashboardPage
