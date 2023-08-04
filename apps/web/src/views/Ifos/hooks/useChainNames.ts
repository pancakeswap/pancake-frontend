import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { chains } from 'utils/wagmi'

export function useChainNames(chainIds?: readonly ChainId[] | ChainId[]) {
  return useMemo(
    () => chainIds?.map((chainId) => chains.find((chain) => chain.id === chainId)?.name)?.join(', ') || '',
    [chainIds],
  )
}
