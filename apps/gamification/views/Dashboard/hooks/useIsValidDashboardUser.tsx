import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { DASHBOARD_ALLOW_LIST } from 'config/constants/dashboardAllowList'
import { FetchStatus } from 'config/constants/types'

const WHITE_LIST_WALLET_ADDRESS = DASHBOARD_ALLOW_LIST.map((i) => i.toLowerCase())

export const useIsValidDashboardUser = () => {
  const { address: account } = useAccount()

  const { data, status } = useQuery({
    queryKey: ['validDashboardUser', account],
    queryFn: () => {
      return Boolean(account) && WHITE_LIST_WALLET_ADDRESS.includes(account?.toLowerCase() ?? '')
    },
    refetchOnWindowFocus: false,
  })

  return {
    isValidLoginToDashboard: data,
    isFetched: status === FetchStatus.Fetched,
  }
}
