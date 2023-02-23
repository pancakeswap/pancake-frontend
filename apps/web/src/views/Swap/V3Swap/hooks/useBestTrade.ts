import { TradeType } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'

import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { useCurrency } from 'hooks/Tokens'
import { useBestAMMTrade } from 'hooks/useBestAMMTrade'

interface Options {
  maxHops?: number
  maxSplits?: number
}

export function useBestTrade({ maxHops, maxSplits }: Options = {}) {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const isExactIn = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const dependentCurrency = isExactIn ? outputCurrency : inputCurrency
  const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
  const amount = tryParseAmount(typedValue, independentCurrency ?? undefined)

  const { isLoading, trade } = useBestAMMTrade({
    amount,
    currency: dependentCurrency,
    baseCurrency: independentCurrency,
    tradeType,
    maxHops,
    maxSplits,
  })
  return {
    isLoading: isLoading || (typedValue && !trade),
    trade: typedValue ? trade : null,
  }
}
