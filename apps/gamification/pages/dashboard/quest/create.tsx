import { SUPPORTED_CHAIN } from 'config/supportedChain'
import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { QuestEditProvider } from 'views/DashboardQuestEdit/context/index'
import { DashboardQuestEdit } from 'views/DashboardQuestEdit/index'

const DashboardQuestCreatePage = () => {
  return (
    <QuestEditProvider>
      <DashboardQuestEdit />
    </QuestEditProvider>
  )
}

DashboardQuestCreatePage.chains = SUPPORTED_CHAIN
DashboardQuestCreatePage.Layout = DashboardLayout

export default DashboardQuestCreatePage
