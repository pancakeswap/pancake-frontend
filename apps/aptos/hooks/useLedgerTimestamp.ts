import { fetchLedgerInfo } from '@pancakeswap/awgmi/core'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useActiveChainId } from './useNetwork'

export const useLedgerTimestamp = () => {
  const chainId = useActiveChainId()
  const queryClient = useQueryClient()
  const { data: lastCheck } = useQuery<number>({
    queryKey: ['ledgerTimestampLastCheck', chainId],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const { data: ledgerTimestamp, error } = useQuery({
    queryKey: ['ledgerTimestamp', chainId],

    queryFn: async () => {
      /* eslint-disable camelcase */
      const { ledger_timestamp } = await fetchLedgerInfo()
      queryClient
        .getQueryCache()
        .find({
          queryKey: ['ledgerTimestampLastCheck', chainId],
        })
        ?.setData(Date.now())
      return Math.floor(parseInt(ledger_timestamp) / 1000)
      /* eslint-enable camelcase */
    },

    enabled: Boolean(chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
    refetchInterval: 1000 * 15,
    staleTime: 1000 * 15,
  })

  return useCallback(() => {
    if (!error && lastCheck && ledgerTimestamp) {
      const timeDiff = Date.now() - lastCheck
      return ledgerTimestamp + timeDiff
    }
    return Date.now()
  }, [error, lastCheck, ledgerTimestamp])
}

export default useLedgerTimestamp
