import { ChainId } from '@pancakeswap/sdk'
import { useSidNameForAddress } from 'hooks/useSid'
import { useUnsNameForAddress } from 'hooks/useUns'
import { useMemo } from 'react'
import { useEnsName } from 'wagmi'
import useActiveWeb3React from './useActiveWeb3React'

export const useDomainNameForAddress = (address: `0x${string}`, fetchData = true) => {
  const { chainId } = useActiveWeb3React()
  const { sidName, isLoading: isSidLoading } = useSidNameForAddress(address, fetchData)
  const { unsName, isLoading: isUnsLoading } = useUnsNameForAddress(address, fetchData && !sidName && !isSidLoading)
  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address,
    chainId,
    cacheTime: 3_600,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
    scopeKey: address,
  })
  return useMemo(() => {
    return {
      domainName: ensName || sidName || unsName,
      isLoading: isEnsLoading || (!ensName && isSidLoading) || (!sidName && isUnsLoading),
    }
  }, [sidName, unsName, isSidLoading, isUnsLoading, ensName, isEnsLoading])
}
