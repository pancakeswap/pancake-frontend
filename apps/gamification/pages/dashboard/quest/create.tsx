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

DashboardQuestCreatePage.Layout = DashboardLayout

export default DashboardQuestCreatePage
