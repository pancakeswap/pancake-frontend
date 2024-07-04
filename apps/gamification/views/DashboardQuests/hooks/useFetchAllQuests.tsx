import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { AllDashboardQuestsType } from 'views/DashboardQuests/type'
import { useAccount } from 'wagmi'

export interface UseFetchAllQuestsProps {
  chainIdList: ChainId[]
  completionStatus: CompletionStatus
}

const PAGE_SIZE = 100

const initialData: AllDashboardQuestsType = {
  quests: [],
  pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, dataInPage: 0 },
}

export const useFetchAllQuests = ({ chainIdList, completionStatus }) => {
  const { address: account } = useAccount()

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['fetch-all-quest-dashboard-data', account, chainIdList, completionStatus],
    queryFn: async () => {
      try {
        if (chainIdList.length === 0) {
          return initialData
        }

        const urlParamsObject = {
          address: account?.toLowerCase(),
          chainId: chainIdList.join(','),
          completionStatus,
          page: 1,
          pageSize: PAGE_SIZE,
        }
        const queryString = qs.stringify(urlParamsObject, { arrayFormat: 'comma' })
        const response = await fetch(`/api/dashboard/all-quests-info?${queryString}`, {
          method: 'GET',
        })

        const result = await response.json()
        const questsData: AllDashboardQuestsType = result
        return questsData
      } catch (error) {
        console.error(`Fetch All quest dashboard data error: ${error}`)
        return initialData
      }
    },
    enabled: Boolean(account && completionStatus),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    questsData: data || initialData,
    isFetching,
    refresh: refetch,
  }
}
