import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { useQueryClient } from '@tanstack/react-query'
import { defaultValueChains } from 'components/NetworkMultiSelector'
import { useEffect, useState } from 'react'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { RecordTemplate } from 'views/DashboardQuests/components/RecordTemplate'
import { Records } from 'views/DashboardQuests/components/Records'
import { useFetchAllQuests } from 'views/DashboardQuests/hooks/useFetchAllQuests'
import { convertIndexToStatus } from 'views/DashboardQuests/utils/convertIndexToStatus'
import { EmptyQuest } from 'views/Quests/components/EmptyQuest'
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
      {!isFetching && questsData.quests?.length === 0 ? (
        <Box
          width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
          margin={[
            '-24px auto 80px auto',
            '-24px auto 80px auto',
            '-24px auto 80px auto',
            '-24px auto 80px auto',
            '-24px auto 80px auto',
            '-24px auto 80px auto',
            'auto',
          ]}
          padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
        >
          <EmptyQuest title={t('There is nothing here, yet')} subTitle={t('Start by creating a quest!')} />
        </Box>
      ) : (
        <Records isFetching={isFetching} questsData={questsData.quests} statusButtonIndex={statusButtonIndex} />
      )}
    </RecordTemplate>
  )
}
