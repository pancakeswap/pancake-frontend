import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/swap-sdk-core'
import { ExclusiveDutchOrderInfo } from '../orders'
import { areCurrenciesEqual } from './utils'

export type ExclusiveDutchOrderTrade<input extends Currency = Currency, output extends Currency = Currency> = {
  tradeType: TradeType
  inputAmount: CurrencyAmount<input>
  outputAmount: CurrencyAmount<output>
  executionPrice: Price<input, output>
  worstExecutionPrice: Price<input, output>
  priceImpact: null
  maximumAmountIn: CurrencyAmount<input>
  minimumAmountOut: CurrencyAmount<output>
  orderInfo: ExclusiveDutchOrderInfo
}

export function createExclusiveDutchOrderTrade<
  input extends Currency,
  output extends Currency,
  tradeType extends TradeType = TradeType,
>({
  currencyIn,
  currenciesOut,
  orderInfo,
  tradeType,
}: {
  currencyIn: input
  currenciesOut: [output] | [output, ...Currency[]]
  orderInfo: ExclusiveDutchOrderInfo
  tradeType: tradeType
}): ExclusiveDutchOrderTrade<input, output> {
  if (orderInfo.outputs.length === 0) {
    throw new Error('there must be at least one output token')
  }

  const output = orderInfo.outputs[0]

  const currencyOut = currenciesOut.find((currency) =>
    areCurrenciesEqual(currency, output.token, currency.chainId),
  ) as output

  if (!currencyOut) {
    throw new Error('currency output from order must exist in currenciesOut list')
  }

  const outputStartEndAmounts = {
    startAmount: CurrencyAmount.fromRawAmount(currencyOut, output.startAmount.toString()),
    endAmount: CurrencyAmount.fromRawAmount(currencyOut, output.endAmount.toString()),
  }

  return {
    tradeType,
    inputAmount: CurrencyAmount.fromRawAmount(currencyIn, orderInfo.input.startAmount.toString()),
    outputAmount: outputStartEndAmounts.startAmount,
    get executionPrice() {
      return new Price(currencyIn, currencyOut, this.inputAmount.quotient, this.outputAmount.quotient)
    },
    get worstExecutionPrice() {
      return new Price(currencyIn, currencyOut, this.maximumAmountIn.quotient, this.minimumAmountOut.quotient)
    },
    priceImpact: null,
    maximumAmountIn: CurrencyAmount.fromRawAmount(currencyIn, orderInfo.input.endAmount.toString()),
    minimumAmountOut: outputStartEndAmounts.endAmount,
    orderInfo,
  }
}
