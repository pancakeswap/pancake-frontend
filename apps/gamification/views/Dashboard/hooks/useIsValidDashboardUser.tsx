import { useQuery } from '@tanstack/react-query'
import { FetchStatus } from 'config/constants/types'
import { useDashboardSiwe } from 'hooks/useDashboardSiwe'
import { useMemo } from 'react'
import { parseSiweMessage } from 'viem/siwe'
import { useAccount } from 'wagmi'

export const useIsValidDashboardUser = () => {
  const { address: account } = useAccount()
  const { siwe, fetchWithSiweAuth } = useDashboardSiwe()

  const isEnabled = useMemo(() => {
    if (account && siwe) {
      const parsed = parseSiweMessage(siwe.message)
      return Boolean(
        parsed &&
          parsed.domain === window.location.host &&
          parsed.uri === window.location.origin &&
          parsed?.address?.toLowerCase() === account?.toLowerCase() &&
          (parsed.expirationTime?.getTime() ?? 0) > Date.now(),
      )
    }

    return null
  }, [account, siwe])

  const { data, status } = useQuery({
    queryKey: ['validDashboardUser', account],
    queryFn: async () => {
      const response = await fetchWithSiweAuth('/api/dashboard/isUserAllowLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      return Boolean(account && result.isAllow)
    },
    enabled: Boolean(isEnabled),
    refetchOnWindowFocus: false,
  })

  if (isEnabled === false) {
    return {
      isValidLoginToDashboard: false,
      isFetched: true,
    }
  }

  return {
    isValidLoginToDashboard: data,
    isFetched: status === FetchStatus.Fetched,
  }
}
