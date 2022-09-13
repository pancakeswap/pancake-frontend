import { FetchLedgerArgs as FetchChainIdArgs, FetchLedgerResult } from '../../core/ledger'

import { QueryConfig } from '../types'
import { useLedger } from './useLedger'

type UseChainIdArgs = Partial<FetchChainIdArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseChainIdConfig = QueryConfig<FetchLedgerResult, Error>

export function useChainId({
  cacheTime = 0,
  networkName: _networkName,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: UseChainIdArgs & UseChainIdConfig = {}) {
  return useLedger({
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    watch,
  })?.data?.chain_id
}
