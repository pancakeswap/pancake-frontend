import { ChainId } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { chains } from 'utils/wagmi'

export function useChainName(chainId?: ChainId) {
  return useMemo(() => chains.find((chain) => chain.id === chainId)?.name || '', [chainId])
}

export function useChainNames(chainIds?: readonly ChainId[] | ChainId[]) {
  return useMemo(
    () => chainIds?.map((chainId) => chains.find((chain) => chain.id === chainId)?.name)?.join(', ') || '',
    [chainIds],
  )
}
