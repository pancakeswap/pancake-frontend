import { BigintIsh, Token } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { getTokensPrice } from './getTokensPrice'

export const getPriceOfToken = (token: Token) => {
  return (tokenA: Token, tokenB: Token, currentSqrtRatioX96: BigintIsh) => {
    invariant(tokenA.equals(token) || tokenB.equals(token), 'TOKEN')
    const prices = getTokensPrice(tokenA, tokenB, currentSqrtRatioX96)

    return tokenA.equals(token) ? prices[0] : prices[1]
  }
}
