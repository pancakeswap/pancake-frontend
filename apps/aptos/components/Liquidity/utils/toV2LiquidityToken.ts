import { Pair, Coin } from '@pancakeswap/aptos-swap-sdk'

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export default function toV2LiquidityToken([tokenA, tokenB]: [Coin, Coin]): Coin {
  return new Coin(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'Cake-LP', 'Pancake LPs')
}
