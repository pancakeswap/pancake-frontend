import { ChainId } from '@pancakeswap/sdk'
import { useSidNameForAddress } from 'hooks/useSid'
import { useUnsNameForAddress } from 'hooks/useUns'
import { useMemo } from 'react'
import { getAddress } from 'viem'
import { useEnsAvatar, useEnsName } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useDomainNameForAddress = (address: `0x${string}` | string, fetchData = true) => {
  const { chainId } = useActiveChainId()
  const { sidName, isLoading: isSidLoading } = useSidNameForAddress(getAddress(address), fetchData)
  const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(
    getAddress(address),
    fetchData && !sidName && !isSidLoading,
  )
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: address as `0x${string}`,
    chainId,
    cacheTime: 3_600,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    address: address as `0x${string}`,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })

  return useMemo(() => {
    return {
      domainName: ensName || sidName || unsName,
      avatar: ensAvatar ?? undefined,
      isLoading: isEnsLoading || isEnsAvatarLoading || (!ensName && isSidLoading) || (!sidName && isUnsLoading),
    }
  }, [sidName, unsName, isSidLoading, isUnsLoading, ensName, isEnsLoading, ensAvatar, isEnsAvatarLoading])
}
