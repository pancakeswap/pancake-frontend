import { AptosClient } from 'aptos'
import { IndexResponse } from 'aptos/dist/generated'
import shallow from 'zustand/shallow'

import { getClient } from './client'
import { getProvider } from './provider'

export type FetchLedgerArgs = {
  networkName?: string
}

export type FetchLedgerResult = IndexResponse

export async function fetchLedgerInfo({ networkName }: FetchLedgerArgs = {}): Promise<FetchLedgerResult> {
  const provider = getProvider({ networkName })
  const ledger = await provider.getLedgerInfo()
  return ledger
}

export type WatchLedgerArgs = { listen: boolean }
export type WatchLedgerCallback = (ledger: FetchLedgerResult) => void
