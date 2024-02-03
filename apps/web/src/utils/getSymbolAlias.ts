import { ChainId } from '@pancakeswap/chains'
import { safeGetAddress } from 'utils'

const TokenAlias = {
  [ChainId.BSC]: {
    '0x346575fC7f07E6994D76199E41D13dC1575322E1': 'DLP',
  },
}

export const getSymbolAlias = (
  address: string | undefined,
  chainId: number | undefined,
  defaultSymbol?: string,
): string | undefined => {
  const addr = safeGetAddress(address)
  if (!addr || !chainId) {
    return defaultSymbol
  }
  return TokenAlias[chainId]?.[addr] ?? defaultSymbol
}
