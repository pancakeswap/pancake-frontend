import { useTranslation } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
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
  const { questData, isFetched } = useGetSingleQuestData(questId ?? '')

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
          task,
          numberOfParticipants,
        } = questData as SingleQuestData
        const startDateConvert = startDateTime ? new Date(convertDateAndTime(startDateTime)) : null
        const endDateConvert = startDateTime ? new Date(convertDateAndTime(endDateTime)) : null

        updateAllState({
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
        })

        onTasksChange(task)
        setShowPage(true)
      }
    }
  }, [questId, isFetched, showPage, questData, onTasksChange, updateAllState, router])

  if (!showPage && questId) {
    return null
  }

  return (
    <DashboardQuestEditContainer>
      <EditTemplate titleText={t('Quest title')} state={state} updateValue={updateValue}>
        {!isDesktop && <Reward reward={state.reward} actionComponent={<SubmitAction />} updateValue={updateValue} />}
        <Tasks />
      </EditTemplate>
      {isDesktop && <Reward reward={state.reward} actionComponent={<SubmitAction />} updateValue={updateValue} />}
    </DashboardQuestEditContainer>
  )
}
