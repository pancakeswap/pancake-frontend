import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useMultichainVeCakeWellSynced } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import { pancakeProfileProxyABI } from 'config/abi/pancakeProfileProxy'
import { FAST_INTERVAL } from 'config/constants'
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

export const useUserVeCakeStatus = (account?: Address, targetChainId?: ChainId) => {
  const { isVeCakeWillSync: isVeCakeSynced } = useMultichainVeCakeWellSynced(targetChainId)

  // Important:
  // From the perspective of the IFO, the profile needs to be synced AND be active.
  // because if its inactive, then the user needs to re-sync to participate in the public sale
  // This is NOT a requirement for Claiming after the IFO expires.
  // (When IFO expires, the profile is made inactive automatically)
  const { data: isProfileActive } = useQuery({
    queryKey: [account, 'profile-proxy-user-status'],
    queryFn: () => getProfileProxyUserStatus(account, targetChainId),
    enabled: Boolean(account && targetChainId && isVeCakeSynced),
    refetchInterval: FAST_INTERVAL,
  })

  const isSynced = useMemo(() => Boolean(isVeCakeSynced && isProfileActive), [isVeCakeSynced, isProfileActive])

  return {
    isSynced,
    isVeCakeSynced: Boolean(isVeCakeSynced),
    isProfileActive: Boolean(isProfileActive),
  }
}
