import { useRouter } from 'next/router'
import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { QuestEditProvider } from 'views/DashboardQuestEdit/context/index'
import { DashboardQuestEdit } from 'views/DashboardQuestEdit/index'

const SingleDashboardQuestEditPage = () => {
  const { query } = useRouter()

  return (
    <QuestEditProvider>
      <DashboardQuestEdit questId={query.id as string} />
    </QuestEditProvider>
  )
}

SingleDashboardQuestEditPage.Layout = DashboardLayout

export default SingleDashboardQuestEditPage
