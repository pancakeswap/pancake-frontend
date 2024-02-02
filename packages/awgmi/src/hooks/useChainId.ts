import { FetchLedgerArgs as FetchChainIdArgs, FetchLedgerResult } from '@pancakeswap/awgmi/core'

import { QueryConfig } from '../types'
import { useLedger } from './useLedger'

type UseChainIdArgs = Partial<FetchChainIdArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseChainIdConfig = QueryConfig<FetchLedgerResult, Error, number>

const select = (ledger: FetchLedgerResult) => ledger.chain_id

export function useChainId({
  gcTime,
  networkName: _networkName,
  enabled = true,
  staleTime,
  watch = false,
}: UseChainIdArgs & UseChainIdConfig = {}) {
  return useLedger({
    gcTime,
    enabled,
    staleTime,
    watch,
    select,
  })
}
