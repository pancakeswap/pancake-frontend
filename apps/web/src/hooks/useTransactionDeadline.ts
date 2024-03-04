import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { L2_CHAIN_IDS } from 'config/chains'
import { DEFAULT_DEADLINE_FROM_NOW, L2_DEADLINE_FROM_NOW } from 'config/constants'

import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useActiveChainId } from './useActiveChainId'

// deadline set by user in minutes, used in all txns
const userTxDeadlineAtom = atomWithStorage<number | undefined>('pcs:user:tx-deadline', undefined)

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export function useTransactionDeadline() {
  const { chainId } = useActiveChainId()
  const [ttl, setTTL] = useAtom(userTxDeadlineAtom)
  const blockTimestamp = useCurrentBlockTimestamp()
  const deadline = useMemo(() => {
    if (blockTimestamp && ttl) return blockTimestamp + BigInt(ttl)
    if (blockTimestamp && chainId && L2_CHAIN_IDS.includes(chainId))
      return blockTimestamp + BigInt(L2_DEADLINE_FROM_NOW)
    if (blockTimestamp && chainId) return blockTimestamp + BigInt(DEFAULT_DEADLINE_FROM_NOW)
    return undefined
  }, [blockTimestamp, ttl, chainId])

  return [deadline, setTTL] as const
}
