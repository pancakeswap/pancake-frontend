import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { useReadContract } from 'wagmi'

export const useVeCakeTotalSupply = () => {
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useReadContract({
    chainId,
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
