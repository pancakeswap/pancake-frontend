import { useTranslation } from '@pancakeswap/localization'
import { useQueryClient } from '@tanstack/react-query'
import { options } from 'components/MultiSelectorUI'
import { useEffect, useMemo, useState } from 'react'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'
import { Records } from 'views/DashboardQuests/components/Records'
import { useFetchAllQuests } from 'views/DashboardQuests/hooks/useFetchAllQuests'
import { convertIndexToStatus } from 'views/DashboardQuests/utils/convertIndexToStatus'
import { useAccount } from 'wagmi'

export const DashboardQuests = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const queryClient = useQueryClient()
  const [statusButtonIndex, setStatusButtonIndex] = useState(CompletionStatusIndex.ONGOING)
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<number>>([])

  const chainsValuePicked = useMemo(() => {
    return pickMultiSelect
      .map((id) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const option = options.find((option) => option.id === id)
        return option ? option.value : null
      })
      .filter((value): value is number => value !== null)
  }, [pickMultiSelect])

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: [
          'fetch-all-quest-dashboard-data',
          account,
          chainsValuePicked,
          convertIndexToStatus(statusButtonIndex),
        ],
      })
    }
  }, [])

  const { questsData, isFetching } = useFetchAllQuests({
    chainIdList: chainsValuePicked,
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
