import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { QuestEditProvider } from 'views/DashboardQuestEdit/context/index'
import { DashboardQuestEdit } from 'views/DashboardQuestEdit/index'

const DashboardQuestEditPage = () => {
  return (
    <QuestEditProvider>
      <DashboardQuestEdit />
    </QuestEditProvider>
  )
}

DashboardQuestEditPage.Layout = DashboardLayout

export default DashboardQuestEditPage
