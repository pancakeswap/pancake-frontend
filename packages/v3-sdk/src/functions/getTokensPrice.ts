import { BigintIsh, Price, Token } from '@pancakeswap/sdk'
import { Q192 } from '../internalConstants'

/**
 * Returns the current price of the given tokens
 *
 * @param tokenA
 * @param tokenB
 * @param currentSqrtRatioX96
 * @returns [token0/token1, token1/token0]
 */
export const getTokensPrice = (
  tokenA: Token,
  tokenB: Token,
  currentSqrtRatioX96: BigintIsh
): [Price<Token, Token>, Price<Token, Token>] => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  const ratio192 = BigInt(currentSqrtRatioX96) * BigInt(currentSqrtRatioX96)

  return [new Price(token0, token1, Q192, ratio192), new Price(token1, token0, Q192, ratio192)]
}
