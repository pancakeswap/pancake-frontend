import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { pancakeProfileProxyABI } from 'config/abi/pancakeProfileProxy'
import { FAST_INTERVAL } from 'config/constants'
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
  targetChainId: ChainId,
): {
  profileProxy?: ProfileProxy | null
  isLoading: boolean
} => {
  const { address: account } = useAccount()
  const enabled = Boolean(account)
  const { data, isLoading } = useQuery({
    queryKey: [account, 'profileProxy', targetChainId],

    queryFn: () => {
      if (!account) return undefined
      return getProfileProxy(account, targetChainId)
    },

    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: FAST_INTERVAL,
  })

  return { profileProxy: data, isLoading }
}

export const useProfileProxyWellSynced = (targetChainId: ChainId) => {
  const { profile, isLoading } = useProfile()
  const { profileProxy, isLoading: isProfileProxyLoading } = useProfileProxy(targetChainId)
  const isSynced = useMemo(() => {
    return (
      !isLoading &&
      !isProfileProxyLoading &&
      profile?.tokenId === profileProxy?.tokenId &&
      profile?.nft?.collectionAddress === profileProxy?.nftAddress &&
      profile?.isActive === profileProxy?.isActive &&
      profile?.points === profileProxy?.points &&
      profile?.userId === profileProxy?.userId
    )
  }, [profile, profileProxy, isLoading, isProfileProxyLoading])

  return { isLoading: isLoading || isProfileProxyLoading, isSynced }
}
