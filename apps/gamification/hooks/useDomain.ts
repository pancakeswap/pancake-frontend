import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address, useEnsAvatar, useEnsName } from 'wagmi'

export const useDomainNameForAddress = (address?: `0x${string}` | string) => {
  const { chainId } = useActiveChainId()

  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: address as Address,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })
  const { data: ensAvatar, isLoading: isEnsAvatarLoading } = useEnsAvatar({
    name: ensName,
    chainId: chainId === ChainId.GOERLI ? ChainId.GOERLI : ChainId.ETHEREUM,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })

  return useMemo(() => {
    return {
      domainName: ensName,
      avatar: ensAvatar ?? undefined,
      isLoading: isEnsLoading || isEnsAvatarLoading,
    }
  }, [ensName, isEnsLoading, ensAvatar, isEnsAvatarLoading])
}
