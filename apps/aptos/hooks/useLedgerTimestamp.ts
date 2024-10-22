import { fetchLedgerInfo } from '@pancakeswap/awgmi/core'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useActiveChainId } from './useNetwork'

export const useLedgerTimestamp = () => {
  const chainId = useActiveChainId()

  const {
    data: ledgerTimestamp,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['ledgerTimestamp', chainId],

    queryFn: async () => {
      /* eslint-disable camelcase */
      const { ledger_timestamp } = await fetchLedgerInfo()
      return Math.floor(parseInt(ledger_timestamp) / 1000)
      /* eslint-enable camelcase */
    },

    enabled: Boolean(chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 1000 * 15,
    staleTime: 1000 * 15,
  })

  return useCallback(() => {
    if (!error && ledgerTimestamp && dataUpdatedAt) {
      const timeDiff = Date.now() - dataUpdatedAt
      return ledgerTimestamp + timeDiff
    }
    return Date.now()
  }, [error, ledgerTimestamp, dataUpdatedAt])
}

export default useLedgerTimestamp
