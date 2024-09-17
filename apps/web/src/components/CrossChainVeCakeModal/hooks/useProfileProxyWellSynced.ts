import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { pancakeProfileProxyABI } from 'config/abi/pancakeProfileProxy'
import { FAST_INTERVAL } from 'config/constants'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'
import { useMemo } from 'react'
import { useProfile } from 'state/profile/hooks'
import { getPancakeProfileProxyAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface ProfileProxy {
  userId: number
  points: number
  tokenId: number
  isActive: boolean
  nftAddress: Address
}

export const getProfileProxy = async (address: Address, targetChainId: ChainId): Promise<ProfileProxy | null> => {
  try {
    const client = publicClient({ chainId: targetChainId })

    const profileCallsResult = await client.multicall({
      contracts: [
        {
          address: getPancakeProfileProxyAddress(targetChainId),
          abi: pancakeProfileProxyABI,
          functionName: 'userProfiles',
          args: [address],
        },
      ],
    })

    const [{ result: profileResponse }] = profileCallsResult

    if (!profileResponse) return null

    const profile = {
      userId: Number(profileResponse[0]),
      points: Number(profileResponse[1]),
      tokenId: Number(profileResponse[3]),
      isActive: profileResponse[4],
      nftAddress: profileResponse[2],
    } as ProfileProxy

    return profile
  } catch (e) {
    console.error(e)
    return null
  }
}

export const useProfileProxy = (
  targetChainId?: ChainId,
): {
  profileProxy?: ProfileProxy | null
  isLoading: boolean
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account) && Boolean(targetChainId)
  const { data, isPending } = useQuery({
    queryKey: [account, 'profileProxy', targetChainId],

    queryFn: () => {
      if (!account) throw new Error('account is required')
      return getProfileProxy(account, targetChainId!)
    },

    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
  })

  return { profileProxy: data, isLoading: isPending }
}

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

export const useProfileProxyUserStatus = (account?: Address, targetChainId?: ChainId, enabled?: boolean) => {
  const { account: localAccount, chainId: localChainId } = useAccountActiveChain()
  const { data: isProfileActive } = useQuery({
    queryKey: [account, 'profile-proxy-user-status'],
    queryFn: () => getProfileProxyUserStatus(account ?? localAccount, targetChainId ?? localChainId),
    enabled:
      (enabled !== undefined ? enabled : true) && Boolean((account || localAccount) && (targetChainId || localChainId)),
    refetchInterval: FAST_INTERVAL,
  })

  return {
    isProfileActive: Boolean(isProfileActive),
  }
}

export const useProfileProxyWellSynced = (targetChainId?: ChainId) => {
  const { profile, isLoading } = useProfile()
  const { profileProxy, isLoading: isProfileProxyLoading } = useProfileProxy(targetChainId)

  // Check if IFO is active for this chain, only then check isProfileActive
  const { activeIfo } = useActiveIfoConfig()
  const isIfoActiveOnChain = useMemo(() => activeIfo?.chainId === targetChainId, [activeIfo, targetChainId])

  const { isProfileActive } = useProfileProxyUserStatus(undefined, targetChainId, isIfoActiveOnChain)

  const isSynced = useMemo(() => {
    return (
      !isLoading &&
      !isProfileProxyLoading &&
      (isIfoActiveOnChain ? isProfileActive : true) &&
      profile?.tokenId === profileProxy?.tokenId &&
      profile?.nft?.collectionAddress === profileProxy?.nftAddress &&
      profile?.isActive === profileProxy?.isActive &&
      profile?.points === profileProxy?.points &&
      profile?.userId === profileProxy?.userId
    )
  }, [profile, profileProxy, isLoading, isProfileProxyLoading, isProfileActive, isIfoActiveOnChain])

  return { isLoading: isLoading || isProfileProxyLoading, isSynced }
}
