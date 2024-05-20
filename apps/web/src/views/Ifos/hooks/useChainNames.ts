import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { chains } from 'utils/wagmi'

const SHORT_NAME = {
  [ChainId.POLYGON_ZKEVM]: 'zkEVM',
  [ChainId.BSC]: 'BNB Chain',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum',
}

type ChainNameOptions = {
  shortName?: boolean
}

export function useChainName(chainId?: ChainId, options?: ChainNameOptions) {
  const name = useMemo(() => chains.find((chain) => chain.id === chainId)?.name || '', [chainId])
  const shortName = (chainId && SHORT_NAME[chainId]) || name
  return options?.shortName ? shortName : name
}

export function useChainNames(chainIds?: readonly ChainId[] | ChainId[]) {
  return useMemo(
    () => chainIds?.map((chainId) => chains.find((chain) => chain.id === chainId)?.name)?.join(', ') || '',
    [chainIds],
  )
}
