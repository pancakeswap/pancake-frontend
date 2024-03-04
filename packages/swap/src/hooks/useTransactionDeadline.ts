import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { L2_CHAIN_IDS } from 'config/chains'
import { L2_DEADLINE_FROM_NOW } from 'config/constants'

import { AppState } from '../state'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useActiveChainId } from './useActiveChainId'

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(): bigint | undefined {
  const { chainId } = useActiveChainId()
  const ttl = useSelector<AppState, number>((state) => state.user.userDeadline)
  const blockTimestamp = useCurrentBlockTimestamp()
  return useMemo(() => {
    if (blockTimestamp && chainId && L2_CHAIN_IDS.includes(chainId))
      return blockTimestamp + BigInt(L2_DEADLINE_FROM_NOW)
    if (blockTimestamp && ttl) return blockTimestamp + BigInt(ttl)
    return undefined
  }, [blockTimestamp, ttl, chainId])
}
