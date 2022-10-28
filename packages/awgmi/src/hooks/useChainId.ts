import { FetchLedgerArgs as FetchChainIdArgs, FetchLedgerResult } from '@pancakeswap/awgmi/core'

import { QueryConfig } from '../types'
import { useLedger } from './useLedger'

type UseChainIdArgs = Partial<FetchChainIdArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseChainIdConfig = QueryConfig<number, Error>

const select = (ledger: FetchLedgerResult) => ledger.chain_id

export function useChainId({
  cacheTime,
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
    select,
  })
}
