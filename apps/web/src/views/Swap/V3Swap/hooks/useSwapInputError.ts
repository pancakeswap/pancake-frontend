import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'

import { isAddress } from 'utils'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'

import { useSlippageAdjustedAmounts } from './useSlippageAdjustedAmounts'

interface Balances {
  [Field.INPUT]?: CurrencyAmount<Currency>
  [Field.OUTPUT]?: CurrencyAmount<Currency>
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: SmartRouterTrade<TradeType>, checksummedAddress: string): boolean {
  // TODO check for pools
  return trade.routes.some((r) => r.path.some((token) => token.isToken && token.address === checksummedAddress))
}

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

export function useSwapInputError(
  trade: SmartRouterTrade<TradeType> | null | undefined,
  currencyBalances: Balances,
): string {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { independentField, typedValue } = useSwapState()
  const inputCurrency = currencyBalances[Field.INPUT]?.currency
  const outputCurrency = currencyBalances[Field.OUTPUT]?.currency
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)

  const to: string | null = account || null

  const isExactIn: boolean = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const parsedAmount = tryParseAmount(typedValue, independentCurrency ?? undefined)

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!inputCurrency || !outputCurrency) {
    inputError = inputError ?? t('Select a token')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  } else if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 || (trade && involvesAddress(trade, formattedTo))) {
    inputError = inputError ?? t('Invalid recipient')
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  return inputError
}
