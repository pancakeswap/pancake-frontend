import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { BigintIsh, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'

export class TokenAmount extends CurrencyAmount<Token> {
  public readonly token: Token

  // amount _must_ be raw, i.e. in the native representation
  public constructor(token: Token, amount: BigintIsh) {
    super(token, amount)
    this.token = token
  }

  public add(other: TokenAmount): TokenAmount {
    invariant(this.token.equals(other.token), 'TOKEN')
    return new TokenAmount(this.token, JSBI.add(this.numerator, other.numerator))
  }

  public subtract(other: TokenAmount): TokenAmount {
    invariant(this.token.equals(other.token), 'TOKEN')
    return new TokenAmount(this.token, JSBI.add(this.numerator, other.numerator))
  }
}
