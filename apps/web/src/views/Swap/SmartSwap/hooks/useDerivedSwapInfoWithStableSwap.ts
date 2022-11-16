import { Currency, CurrencyAmount, Pair, Route, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import useSWR from 'swr'
import {
  getBestTradeExactIn,
  getBestTradeExactOut,
  createStableSwapPair,
  TradeWithStableSwap,
  RouteType,
  StableSwapPair,
} from '@pancakeswap/smart-router/evm'
import { getBestPriceWithRouter, RequestBody } from 'state/swap/fetch/fetchBestPriceWithRouter'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useStableFarms } from 'views/Swap/StableSwap/hooks/useStableConfig'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import { isAddress } from 'utils'
import { provider } from 'utils/wagmi'

import { computeSlippageAdjustedAmounts } from '../utils/exchange'

const isToken = (currency: Currency): currency is Token => {
  // @ts-ignore
  return Boolean(currency?.address)
}

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
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some(
      (pair) =>
        (pair as StableSwapPair).stableSwapAddress === checksummedAddress ||
        (pair as Pair).liquidityToken.address === checksummedAddress,
    )
  )
}

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

const useMatchStableSwap = (inputCurrency: Currency | undefined, outputCurrency: Currency | undefined) => {
  let matchFarm
  const stableFarms = useStableFarms()
  if (isToken(inputCurrency) && isToken(outputCurrency)) {
    matchFarm = stableFarms.find(
      ({ token0, token1 }) =>
        (token0.address === inputCurrency.address && token1.address === outputCurrency.address) ||
        (token1.address === inputCurrency.address && token0.address === outputCurrency.address),
    )
  }
  return Boolean(matchFarm)
}

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
  v2Trade: Trade<Currency, Currency, TradeType> | undefined
  trade: TradeWithStableSwap<Currency, Currency, TradeType> | null
  inputError?: string
} {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const to: string | null = (recipient === null ? account : isAddress(recipient) || null) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestPriceFromApi = useGetBestPriceWithRouter(
    inputCurrency,
    outputCurrency,
    parsedAmount,
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
  )

  const { data: bestTradeExactInData } = useSWR(
    parsedAmount && `Swap${inputCurrency.symbol}to${outputCurrency.symbol}In${parsedAmount?.numerator.toString()}}`,
    () => getBestTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, { provider }),
    { refreshInterval: 5000 },
  )
  const { data: bestTradeExactOutData } = useSWR(
    parsedAmount && `Swap${inputCurrency.symbol}to${outputCurrency.symbol}Out${parsedAmount?.numerator.toString()}`,
    () => getBestTradeExactOut(!isExactIn ? parsedAmount : undefined, inputCurrency ?? undefined, { provider }),
    { refreshInterval: 5000 },
  )
  const bestTradeWithStableSwap = bestPriceFromApi || (isExactIn ? bestTradeExactInData : bestTradeExactOutData)
  const v2Trade =
    bestTradeWithStableSwap?.route.routeType === RouteType.V2
      ? createV2TradeFromTradeWithStableSwap(bestTradeWithStableSwap)
      : undefined
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
    v2Trade: v2Trade ?? undefined,
    inputError,
  }
}

// TODO support exact output
const useGetBestPriceWithRouter = (
  inputCurrency: Currency,
  outputCurrency: Currency,
  parsedAmount: CurrencyAmount<Currency>,
  tradeType: TradeType,
): TradeWithStableSwap<Currency, Currency, TradeType> | null => {
  const rawAmount = parsedAmount?.quotient.toString()
  const requestBody: RequestBody = {
    networkId: inputCurrency?.chainId,
    baseToken: isToken(inputCurrency) ? inputCurrency.address : inputCurrency?.wrapped.address, // TODO: support 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE as native
    baseTokenName: inputCurrency?.name,
    baseTokenAmount: tradeType === TradeType.EXACT_INPUT ? rawAmount : undefined,
    baseTokenNumDecimals: inputCurrency?.decimals,
    quoteToken: isToken(outputCurrency) ? outputCurrency.address : outputCurrency?.wrapped.address, // TODO: support 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE as native
    quoteTokenAmount: tradeType === TradeType.EXACT_OUTPUT ? rawAmount : undefined,
    quoteTokenName: outputCurrency?.name,
    quoteTokenNumDecimals: outputCurrency?.decimals,
    trader: 'huan', // TODO: maybe use user Wallet address
  }
  const { data } = useSWR(
    parsedAmount &&
      `Swap${inputCurrency.symbol}to${outputCurrency.symbol}In${parsedAmount?.numerator.toString()}WithAPI`,
    () => getBestPriceWithRouter(requestBody),
    { refreshInterval: 5000 },
  )

  if (!data) {
    return null
  }

  const input = deserializeToken(data.route.input)
  const output = deserializeToken(data.route.output)
  return {
    tradeType: data.tradeType,
    route: {
      ...data.route,
      input,
      output,
      pairs: data.route.pairs.map((p) => {
        const token0 = deserializeToken(p.token0)
        const token1 = deserializeToken(p.token1)
        const reserve0 = CurrencyAmount.fromRawAmount(token0, p.reserve0)
        const reserve1 = CurrencyAmount.fromRawAmount(token1, p.reserve1)
        const pair = new Pair(reserve0, reserve1)
        return p.stableSwapAddress ? createStableSwapPair(pair, p.stableSwapAddress) : pair
      }),
      path: data.route.path.map((t) => deserializeToken(t)),
    },
    inputAmount: CurrencyAmount.fromRawAmount(input, data.inputAmount),
    outputAmount: CurrencyAmount.fromRawAmount(output, data.outputAmount),
  }
}

function createV2TradeFromTradeWithStableSwap(
  trade: TradeWithStableSwap<Currency, Currency, TradeType>,
): Trade<Currency, Currency, TradeType> | undefined {
  if (trade.route.routeType !== RouteType.V2) {
    return undefined
  }
  const pairs: Pair[] = trade.route.pairs.map((pair) => new Pair(pair.reserve0, pair.reserve1))
  const route = new Route(pairs, trade.inputAmount.currency, trade.outputAmount.currency)
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return Trade.exactIn(route, trade.inputAmount)
  }
  return Trade.exactOut(route, trade.outputAmount)
}
