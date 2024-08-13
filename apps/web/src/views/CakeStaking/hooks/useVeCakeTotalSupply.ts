import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useReadContract } from '@pancakeswap/wagmi'
import { getVeCakeAddress, getVeCakeAddressNoFallback } from 'utils/addressHelpers'
import { ChainId } from '@pancakeswap/chains'

export const useVeCakeTotalSupply = () => {
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useReadContract({
    chainId: getVeCakeAddressNoFallback(chainId) ? chainId : ChainId.BSC,
    address: getVeCakeAddress(chainId),
    functionName: 'totalSupply',
    abi: veCakeABI,
    query: {
      enabled: Boolean(getVeCakeAddress(chainId)),
    },
  })

  return {
    data: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
