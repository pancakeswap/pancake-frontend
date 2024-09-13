import { ChainId } from '@pancakeswap/chains'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { useMemo } from 'react'
import { Address } from 'viem/accounts'
import { useProfileProxyUserStatus } from './useProfileProxyWellSynced'

export const useUserVeCakeStatus = (account?: Address, targetChainId?: ChainId, targetTime?: number) => {
  const {
    isVeCakeWillSync: isVeCakeSynced,
    bscBalance,
    bscProxyBalance,
    targetChainBalance,
    targetChainProxyBalance,
  } = useMultichainVeCakeWellSynced(targetChainId, targetTime)

  // Important:
  // From the perspective of the IFO, the profile needs to be synced AND be active.
  // because if its inactive, then the user needs to re-sync to participate in the public sale
  // This is NOT a requirement for Claiming after the IFO expires.
  // (When IFO expires, the profile is made inactive automatically)
  const { isProfileActive } = useProfileProxyUserStatus(account, targetChainId, Boolean(isVeCakeSynced))

  const isSynced = useMemo(() => Boolean(isVeCakeSynced && isProfileActive), [isVeCakeSynced, isProfileActive])

  return {
    isSynced,
    isVeCakeSynced: Boolean(isVeCakeSynced),
    isProfileActive: Boolean(isProfileActive),
    bscBalance,
    bscProxyBalance,
    targetChainBalance,
    targetChainProxyBalance,
  }
}
