import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { useState } from 'react'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'
import { Records } from 'views/DashboardQuests/components/Records'
import { useFetchAllQuests } from 'views/DashboardQuests/hooks/useFetchAllQuests'
import { convertIndexToStatus } from 'views/DashboardQuests/utils/convertIndexToStatus'

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const [statusButtonIndex, setStatusButtonIndex] = useState(CompletionStatusIndex.ONGOING)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<ChainId>>([])

  const { questsData, isFetching } = useFetchAllQuests({
    completionStatus: convertIndexToStatus(statusButtonIndex),
  })

  return (
    <RecordTemplate
      title={t('Quests')}
      createLink="/dashboard/quest/create"
      createButtonText={t('Create')}
      statusButtonIndex={statusButtonIndex}
      pickMultiSelect={pickMultiSelect}
      setPickMultiSelect={setPickMultiSelect}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records isFetching={isFetching} questsData={questsData.quests} statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
