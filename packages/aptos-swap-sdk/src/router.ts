import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Coin } from 'coin'
import { cpScriptsSwapScript } from './generated/swap'

export abstract class AptosSwapRouter {
  public static swapCallParameters(a: Coin, b: Coin, amountIn: CurrencyAmount<Coin>) {
    return cpScriptsSwapScript([amountIn.quotient.toString(), '0', '0', '0'], [a.address, b.address])
  }
}
