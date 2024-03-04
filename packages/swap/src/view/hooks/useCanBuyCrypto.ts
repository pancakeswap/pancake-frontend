import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'

export const SUPPORT_BUY_CRYPTO = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ZKSYNC, // NO PROVIDER SUPPORT ZK_SYNC_ERA
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.BASE,
]

export function isBuyCryptoSupported(chain: ChainId) {
  return SUPPORT_BUY_CRYPTO.includes(chain)
}

export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB']

interface Params {
  currencySymbol?: string
  chainId?: ChainId
}

export function useCanBuyCrypto({ currencySymbol, chainId }: Params) {
  return useMemo(
    () =>
      !!currencySymbol &&
      !!chainId &&
      isBuyCryptoSupported(chainId) &&
      SUPPORTED_ONRAMP_TOKENS.includes(currencySymbol),
    [currencySymbol, chainId]
  )
}
