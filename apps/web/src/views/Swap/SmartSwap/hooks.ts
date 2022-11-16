import { Currency, CurrencyAmount, Pair, Route, Token, Trade, TradeType } from '@pancakeswap/sdk'
import useSWR from 'swr'
import { getBestTradeExactIn, getBestTradeExactOut } from '@pancakeswap/smart-router/evm'
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
import { computeSlippageAdjustedAmounts } from 'utils/exchange'

const isToken = (currency: Currency): currency is Token => {
  // @ts-ignore
  return Boolean(currency?.address)
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
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
  inputError?: string
} {
  const isMatchStableSwap = useMatchStableSwap(inputCurrency, outputCurrency)
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const to: string | null = (recipient === null ? account : isAddress(recipient) || null) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestPriceFromApi = useGetBestPriceWithRouter(inputCurrency, outputCurrency, parsedAmount)

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

  const exactInRoute = bestTradeExactInData
    ? new Route(
        bestTradeExactInData.route.pairs as Pair[], // if the path without stable swap it will work
        bestTradeExactInData.route.input,
        bestTradeExactInData.route.output,
      )
    : undefined

  const exactOutRoute = bestTradeExactOutData
    ? new Route(
        bestTradeExactOutData.route.pairs as Pair[], // if the path without stable swap it will work
        bestTradeExactOutData.route.input,
        bestTradeExactOutData.route.output,
      )
    : undefined

  const newbestTradeExactIn =
    bestTradeExactInData && exactInRoute
      ? new Trade(exactInRoute, bestTradeExactInData.inputAmount, TradeType.EXACT_INPUT)
      : undefined

  const newbestTradeExactOut = bestTradeExactOutData
    ? new Trade(exactOutRoute, bestTradeExactOutData.outputAmount, TradeType.EXACT_OUTPUT)
    : undefined

  console.log(newbestTradeExactIn, newbestTradeExactOut, 'newbestTradeExactFromSDK')
  console.log(isMatchStableSwap, 'isMatchStableSwap')
  console.log(bestPriceFromApi, 'bestPriceFromBEApi')

  const v2Trade = bestPriceFromApi || isExactIn ? newbestTradeExactIn : newbestTradeExactOut

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
    (newbestTradeExactIn && involvesAddress(newbestTradeExactIn, formattedTo)) ||
    (newbestTradeExactOut && involvesAddress(newbestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? t('Invalid recipient')
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
  }
}

const useGetBestPriceWithRouter = (
  inputCurrency: Currency,
  outputCurrency: Currency,
  parsedAmount: CurrencyAmount<Currency>,
) => {
  const requestBody: RequestBody = {
    networkId: inputCurrency?.chainId,
    baseToken: isToken(inputCurrency) ? inputCurrency.address : inputCurrency?.wrapped.address, // TODO: support 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE as native
    baseTokenName: inputCurrency?.name,
    baseTokenAmount: parsedAmount?.numerator.toString(),
    baseTokenNumDecimals: inputCurrency?.decimals,
    quoteToken: isToken(outputCurrency) ? outputCurrency.address : outputCurrency?.wrapped.address, // TODO: support 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE as native
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
  const pairs = data
    ? data.route.pairs.map(({ token0, token1, reserve0, reserve1 }) => {
        const token0Data = new Token(token0.chainId, token0.address, token0.decimals, token0.symbol)
        const token1Data = new Token(token1.chainId, token1.address, token1.decimals, token1.symbol)
        return new Pair(
          CurrencyAmount.fromRawAmount(token0Data, reserve0),
          CurrencyAmount.fromRawAmount(token1Data, reserve1),
        )
      })
    : undefined
  const route = pairs
    ? new Route(
        pairs, // if the path without stable swap it will work
        inputCurrency,
        outputCurrency,
      )
    : undefined

  const v2TradeFromAPI = route ? new Trade(route, parsedAmount, TradeType.EXACT_INPUT) : undefined

  return v2TradeFromAPI // TODO: for now v2 only and need to support TradeWithStableSwap
}
