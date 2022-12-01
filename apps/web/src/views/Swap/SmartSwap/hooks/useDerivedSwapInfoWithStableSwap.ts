import { Currency, CurrencyAmount, Pair, TradeType } from '@pancakeswap/sdk'
import { StableSwapPair, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useTranslation } from '@pancakeswap/localization'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useUserSingleHopOnly, useUserSlippageTolerance } from 'state/user/hooks'
import { isAddress } from 'utils'

import { computeSlippageAdjustedAmounts } from '../utils/exchange'
import { useBestTrade } from './useBestTrade'

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(
  trade: TradeWithStableSwap<Currency, Currency, TradeType>,
  checksummedAddress: string,
): boolean {
  return (
    trade.route.path.some((token) => token.isToken && token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) =>
        (pair as StableSwapPair)?.stableSwapAddress === checksummedAddress ||
        (pair as Pair)?.liquidityToken?.address === checksummedAddress,
    )
  )
}

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

export function useDerivedSwapInfoWithStableSwap(
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  recipient: string,
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  trade: TradeWithStableSwap<Currency, Currency, TradeType> | null
  inputError?: string
} {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [singleHop] = useUserSingleHopOnly()

  const to: string | null = (recipient === null ? account : isAddress(recipient) || null) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const dependentCurrency = isExactIn ? outputCurrency : inputCurrency
  const parsedAmount = tryParseAmount(typedValue, independentCurrency ?? undefined)

  const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
  const bestTradeWithStableSwap = useBestTrade(parsedAmount, dependentCurrency, tradeType, {
    maxHops: singleHop ? 1 : 3,
  })
  // TODO add invariant make sure v2 trade has the same input & output amount as trade with stable swap

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestTradeWithStableSwap && involvesAddress(bestTradeWithStableSwap, formattedTo))
  ) {
    inputError = inputError ?? t('Invalid recipient')
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts =
    bestTradeWithStableSwap &&
    allowedSlippage &&
    computeSlippageAdjustedAmounts(bestTradeWithStableSwap, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  return {
    trade: bestTradeWithStableSwap,
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
  }
}
