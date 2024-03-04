import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

import { L2_CHAIN_IDS } from 'config/chains'
import { DEFAULT_DEADLINE_FROM_NOW, L2_DEADLINE_FROM_NOW } from 'config/constants'

import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useActiveChainId } from './useActiveChainId'

// deadline set by user in minutes, used in all txns
const userTxTTLAtom = atomWithStorage<number | undefined>('pcs:user:tx-ttl', undefined)

export function useUserTransactionTTL() {
  const { chainId } = useActiveChainId()
  const [userTTL, setTTL] = useAtom(userTxTTLAtom)
  const ttl = useMemo(
    () =>
      userTTL === undefined
        ? chainId && L2_CHAIN_IDS.includes(chainId)
          ? L2_DEADLINE_FROM_NOW
          : DEFAULT_DEADLINE_FROM_NOW
        : userTTL,
    [userTTL, chainId],
  )
  return [ttl, setTTL] as const
}

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export function useTransactionDeadline() {
  const [ttl, setTTL] = useUserTransactionTTL()
  const blockTimestamp = useCurrentBlockTimestamp()
  const deadline = useMemo(() => {
    if (blockTimestamp && ttl) return blockTimestamp + BigInt(ttl)
    return undefined
  }, [blockTimestamp, ttl])

  return [deadline, setTTL] as const
}
