import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'

const AVAILABLE_CHAINS = [ChainId.BSC, ChainId.ETHEREUM, ChainId.ARBITRUM_ONE]

const MATCH_SYMBOLS = ['busd', 'usdt', 'usdc']

export function useUsdvMintAvailable({ tokenSymbol, chainId }: { tokenSymbol?: string; chainId?: ChainId }) {
  return useMemo(
    () =>
      Boolean(
        chainId &&
          tokenSymbol &&
          AVAILABLE_CHAINS.includes(chainId) &&
          MATCH_SYMBOLS.some((symbol) => symbol.toLowerCase() === tokenSymbol.toLowerCase()),
      ),
    [tokenSymbol, chainId],
  )
}
