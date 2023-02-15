import { ChainId, Token } from '@pancakeswap/sdk'

import { nativeWrappedTokenByChain } from '../../constants'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return nativeWrappedTokenByChain[chainId] ?? null
}
