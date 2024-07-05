import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { useQueryClient } from '@tanstack/react-query'
import { defaultValueChains } from 'components/NetworkMultiSelector'
import { useEffect, useState } from 'react'
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
  const [pickMultiSelect, setPickMultiSelect] = useState<Array<ChainId>>(defaultValueChains)

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ['fetch-all-quest-dashboard-data', account, pickMultiSelect, convertIndexToStatus(statusButtonIndex)],
      })
    }
  }, [account, pickMultiSelect, queryClient, statusButtonIndex])

  const { questsData, isFetching } = useFetchAllQuests({
    chainIdList: pickMultiSelect,
    completionStatus: convertIndexToStatus(statusButtonIndex),
  })

  return (
    <RecordTemplate
      title={t('Quests')}
      createLink="/dashboard/quest/create"
      createButtonText={t('Create')}
      statusButtonIndex={statusButtonIndex}
      setPickMultiSelect={setPickMultiSelect}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      <Records isFetching={isFetching} questsData={questsData.quests} statusButtonIndex={statusButtonIndex} />
    </RecordTemplate>
  )
}
