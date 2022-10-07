import { Currency, decorators } from '@pancakeswap/aptos-swap-sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'

export class WrappedCoinInfo extends WrappedTokenInfo {
  public sortsBefore(other: Currency): boolean {
    return decorators.sortBeforeByBytes(this, other.wrapped)
  }
}
