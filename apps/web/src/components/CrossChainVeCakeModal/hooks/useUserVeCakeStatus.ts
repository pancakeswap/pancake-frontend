import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { pancakeProfileProxyABI } from 'config/abi/pancakeProfileProxy'
import { FAST_INTERVAL } from 'config/constants'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { getPancakeProfileProxyAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/viem'
import { Address } from 'viem/accounts'

export const getProfileProxyUserStatus = async (account?: Address, targetChainId?: ChainId) => {
  if (!account || !targetChainId) return false

  try {
    const client = publicClient({ chainId: targetChainId })

    // Returns a boolean indicating if profile is active or not
    return client.readContract({
      abi: pancakeProfileProxyABI,
      address: getPancakeProfileProxyAddress(targetChainId),
      functionName: 'getUserStatus',
      args: [account],
    })
  } catch (e) {
    console.error(e)
    return false
  }
}

export const useUserVeCakeStatus = (account?: Address, targetChainId?: ChainId, targetTime?: number) => {
  const { account: localAccount, chainId: localChainId } = useAccountActiveChain()

  const {
    isVeCakeWillSync: isVeCakeSynced,
    bscBalance,
    bscProxyBalance,
    targetChainBalance,
    targetChainProxyBalance,
  } = useMultichainVeCakeWellSynced(targetChainId, targetTime)

  // TODO: Include useProfileProxyWellSynced here as well

  // const { isSynced } = useProfileProxyWellSynced(targetChainId)

  // Important:
  // From the perspective of the IFO, the profile needs to be synced AND be active.
  // because if its inactive, then the user needs to re-sync to participate in the public sale
  // This is NOT a requirement for Claiming after the IFO expires.
  // (When IFO expires, the profile is made inactive automatically)
  const { data: isProfileActive } = useQuery({
    queryKey: [account, 'profile-proxy-user-status'],
    queryFn: () => getProfileProxyUserStatus(account ?? localAccount, targetChainId ?? localChainId),
    enabled: Boolean((account || localAccount) && (targetChainId || localChainId) && isVeCakeSynced),
    refetchInterval: FAST_INTERVAL,
  })

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
