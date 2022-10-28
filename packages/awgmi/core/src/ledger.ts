import { Types } from 'aptos'

import { getProvider } from './providers'

export type FetchLedgerArgs = {
  networkName?: string
}

export type FetchLedgerResult = Types.IndexResponse

export async function fetchLedgerInfo({ networkName }: FetchLedgerArgs = {}): Promise<FetchLedgerResult> {
  const provider = getProvider({ networkName })
  const ledger = await provider.getLedgerInfo()
  return ledger
}

export type WatchLedgerArgs = { listen: boolean }
export type WatchLedgerCallback = (ledger: FetchLedgerResult) => void
