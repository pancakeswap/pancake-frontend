import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DashboardLayout } from 'views/Dashboard/components/DashboardLayout'
import { QuestEditProvider } from 'views/DashboardQuestEdit/context/index'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useGetSingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { DashboardQuestEdit } from 'views/DashboardQuestEdit/index'
import { convertDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const SingleDashboardQuestEditPage = () => {
  const { query } = useRouter()
  const [showPage, setShowPage] = useState(false)
  const { questData, isFetched } = useGetSingleQuestData((query.id as string) ?? '')
  const { onTasksChange, updateAllState } = useQuestEdit()

  useEffect(() => {
    if (!showPage && isFetched && questData) {
      const { orgId, chainId, completionStatus, title, description, reward, startDateTime, endDateTime } = questData
      const startDateConvert = startDateTime ? new Date(convertDateAndTime(startDateTime)) : null
      const endDateConvert = startDateTime ? new Date(convertDateAndTime(endDateTime)) : null

      updateAllState({
        chainId,
        orgId,
        completionStatus,
        title,
        description,
        startDate: startDateConvert,
        startTime: startDateConvert,
        endDate: endDateConvert,
        endTime: endDateConvert,
        reward,
        startDateTime,
        endDateTime,
      })
      onTasksChange(questData.task)
      setShowPage(false)
    }
  }, [isFetched, showPage, questData, onTasksChange, updateAllState])

  return <QuestEditProvider>{showPage && <DashboardQuestEdit />}</QuestEditProvider>
}

SingleDashboardQuestEditPage.Layout = DashboardLayout

export default SingleDashboardQuestEditPage
