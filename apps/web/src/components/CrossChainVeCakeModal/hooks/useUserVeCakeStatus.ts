import { ChainId } from '@pancakeswap/chains'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { useMemo } from 'react'
import { useProfileProxyWellSynced } from './useProfileProxyWellSynced'

export const useUserVeCakeStatus = (targetChainId?: ChainId, targetTime?: number) => {
  const {
    isVeCakeWillSync: isVeCakeSynced,
    bscBalance,
    bscProxyBalance,
    targetChainBalance,
    targetChainProxyBalance,
  } = useMultichainVeCakeWellSynced(targetChainId, targetTime)

  const { isSynced: isProfileSynced } = useProfileProxyWellSynced(targetChainId)

  const isSynced = useMemo(() => Boolean(isVeCakeSynced && isProfileSynced), [isVeCakeSynced, isProfileSynced])

  return {
    isSynced,
    isVeCakeSynced: Boolean(isVeCakeSynced),
    isProfileSynced: Boolean(isProfileSynced),
    bscBalance,
    bscProxyBalance,
    targetChainBalance,
    targetChainProxyBalance,
  }
}
