import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useSiwe } from 'hooks/useSiwe'
import { StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useAccount } from 'wagmi'

export interface SingleQuestData extends StateType {
  tasks: TaskConfigType[]
}

export interface SingleQuestDataError {
  error: string
}

export const useGetSingleQuestData = (id: string) => {
  const { address, chainId } = useAccount()
  const { signIn } = useSiwe()
  const { data, refetch, isFetching, status } = useQuery<SingleQuestData | SingleQuestDataError>({
    queryKey: ['fetch-single-quest-dashboard-data', address, chainId, id],
    queryFn: async () => {
      if (!address || !chainId) {
        throw new Error('Unable to fetch dashboard data')
      }
      const { message, signature } = await signIn({ address, chainId })
      const response = await fetch(`/api/dashboard/quest-info?id=${id}`, {
        method: 'GET',
        headers: {
          'X-G-Siwe-Message': encodeURIComponent(message),
          'X-G-Siwe-Signature': signature,
          'X-G-Siwe-Chain-Id': String(chainId),
        },
      })

      if (!response.ok) {
        const errorData: SingleQuestDataError = await response.json()
        throw new Error(errorData.error)
      }

      const questData: SingleQuestData = await response.json()
      return questData
    },
    enabled: Boolean(id),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    questData: data,
    isFetching,
    isFetched: status === FetchStatus.Fetched,
    refresh: refetch,
  }
}
