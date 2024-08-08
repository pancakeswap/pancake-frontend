import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { nanoid } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { EditTemplate } from 'views/DashboardQuestEdit/components/EditTemplate'
import { Reward } from 'views/DashboardQuestEdit/components/Reward'
import { SubmitAction } from 'views/DashboardQuestEdit/components/SubmitAction'
import { Tasks } from 'views/DashboardQuestEdit/components/Tasks'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import {
  SingleQuestData,
  SingleQuestDataError,
  useGetSingleQuestData,
} from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { convertDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const DashboardQuestEditContainer = styled(Flex)`
  padding: 16px;
  margin: auto;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
  }
`

export const DashboardQuestEdit = ({ questId }: { questId?: string }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showPage, setShowPage] = useState(false)
  const { isDesktop } = useMatchBreakpoints()
  const { state, updateValue, onTasksChange, updateAllState } = useQuestEdit()
  const { questData, isFetched } = useGetSingleQuestData(questId as string)

  useEffect(() => {
    if (!showPage && questId && isFetched && questData) {
      if ((questData as SingleQuestDataError).error) {
        router.push('/dashboard')
      } else {
        const {
          id,
          orgId,
          chainId,
          completionStatus,
          title,
          description,
          reward,
          startDateTime,
          endDateTime,
          rewardSCAddress,
          ownerAddress,
          tasks,
          numberOfParticipants,
          needAddReward,
        } = questData as SingleQuestData
        const startDateConvert = startDateTime > 0 ? new Date(convertDateAndTime(startDateTime)) : null
        const endDateConvert = endDateTime > 0 ? new Date(convertDateAndTime(endDateTime)) : null
        const newTasks = tasks.length > 0 ? tasks.map((i) => ({ ...i, sid: nanoid(100) })) : tasks

        updateAllState(
          {
            id,
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
            rewardSCAddress,
            ownerAddress,
            numberOfParticipants,
            needAddReward,
          },
          newTasks,
        )

        setShowPage(true)
      }
    }
  }, [questId, isFetched, showPage, questData, onTasksChange, updateAllState, router])

  if (!showPage && questId) {
    return null
  }

  return (
    <DashboardQuestEditContainer>
      <EditTemplate
        titleText={t('Quest')}
        state={state}
        questId={questId}
        backButtonUrl="/dashboard"
        updateValue={updateValue}
      >
        {!isDesktop && <Reward state={state} actionComponent={<SubmitAction />} updateValue={updateValue} />}
        <Tasks state={state} />
      </EditTemplate>
      {isDesktop && <Reward state={state} actionComponent={<SubmitAction />} updateValue={updateValue} />}
    </DashboardQuestEditContainer>
  )
}
