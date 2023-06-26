import { ChainId, Token, WNATIVE } from '@pancakeswap/sdk'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
