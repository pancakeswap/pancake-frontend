import { Token, WNATIVE } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
