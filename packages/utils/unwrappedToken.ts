import { Token, Currency } from '@pancakeswap/swap-sdk-core'
import { WNATIVE, Native } from '@pancakeswap/sdk'

export function unwrappedToken(token: Token): Currency {
  if (token && token.equals(WNATIVE[token.chainId])) return Native.onChain(token.chainId)
  return token
}
