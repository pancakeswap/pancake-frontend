import type { CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'

export interface BasePair {
  token0: ERC20Token
  token1: ERC20Token
  reserve0: CurrencyAmount<ERC20Token>
  reserve1: CurrencyAmount<ERC20Token>
  involvesToken: (token: ERC20Token) => boolean
}
