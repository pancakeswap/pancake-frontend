import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'

const SUPPORTED_ONRAMP_TOKENS = {
  [ChainId.BSC]: ['BNB', 'CAKE', 'USDT', 'USDC'],
  [ChainId.ETHEREUM]: ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC'],
  [ChainId.POLYGON_ZKEVM]: ['ETH'],
  [ChainId.ZKSYNC]: ['ETH'],
  [ChainId.ARBITRUM_ONE]: ['ETH', 'USDC'],
  [ChainId.LINEA]: ['ETH', 'USDC'],
  [ChainId.BASE]: ['ETH', 'USDC'],
}

interface Params {
  currencySymbol?: string
  chainId?: ChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () => !!currencySymbol && !!chainId && SUPPORTED_ONRAMP_TOKENS[chainId]?.includes(currencySymbol), // check CAKE with BSC only
    [currencySymbol, chainId],
  )
}
