import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { useQueryClient } from '@tanstack/react-query'
import { defaultValueChains } from 'components/NetworkMultiSelector'
import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
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

  const { quests, page, loadMore, isFetching, hasNextPage } = useFetchAllQuests({
    chainIdList: pickMultiSelect,
    completionStatus: convertIndexToStatus(statusButtonIndex),
  })

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: [
          'fetch-all-quest-dashboard-data',
          page,
          account,
          pickMultiSelect,
          convertIndexToStatus(statusButtonIndex),
        ],
      })
    }
  }, [page, account, pickMultiSelect, queryClient, statusButtonIndex])

  const [sentryRef] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage,
    onLoadMore: loadMore,
  })

  return (
    <RecordTemplate
      title={t('Quests')}
      createLink="/dashboard/quest/create"
      createButtonText={t('Create')}
      pickMultiSelect={pickMultiSelect}
      statusButtonIndex={statusButtonIndex}
      setPickMultiSelect={setPickMultiSelect}
      setStatusButtonIndex={setStatusButtonIndex}
    >
      {!isFetching && quests?.length === 0 ? (
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
          <EmptyQuest title={t('There is nothing here, yet')} subTitle={t('Get started by creating your quest')} />
        </Box>
      ) : (
        <Records
          sentryRef={sentryRef}
          questsData={quests}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          statusButtonIndex={statusButtonIndex}
        />
      )}
    </RecordTemplate>
  )
}
