import { Price, Token } from '@pancakeswap/sdk'
import { Position } from '@pancakeswap/v3-sdk'

export default function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // Philip TODO: Add stable coin addresses
  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = []
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  // const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC]
  // if (bases.some((base) => base && base.equals(token1))) {
  //   return {
  //     priceLower: position.token0PriceUpper.invert(),
  //     priceUpper: position.token0PriceLower.invert(),
  //     quote: token0,
  //     base: token1,
  //   }
  // }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}
