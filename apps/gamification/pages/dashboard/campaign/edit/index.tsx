import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { CampaignEditProvider } from 'views/DashboardCampaignEdit/context/index'
import { DashboardCampaignEdit } from 'views/DashboardCampaignEdit/index'

const DashboardCampaignEditPage = () => {
  return (
    <CampaignEditProvider>
      <DashboardCampaignEdit />
    </CampaignEditProvider>
  )
}

DashboardCampaignEditPage.Layout = DashboardLayout

export default DashboardCampaignEditPage
