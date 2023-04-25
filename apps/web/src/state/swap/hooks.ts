import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Price, Trade, TradeType } from '@pancakeswap/sdk'
import { CAKE, USDC } from '@pancakeswap/tokens'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY } from 'config/constants/exchange'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isAddress } from 'utils'
import { computeSlippageAdjustedAmounts } from 'utils/exchange'
import getLpAddress from 'utils/getLpAddress'
import { multicallv2 } from 'utils/multicall'
import { getTokenAddress } from 'views/Swap/components/Chart/utils'
import { useBestAMMTrade } from 'hooks/useBestAMMTrade'
import { useAccount } from 'wagmi'
import useSWRImmutable from 'swr/immutable'
import { SLOW_INTERVAL } from 'config/constants'
import { AppState, useAppDispatch } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, replaceSwapState, updateDerivedPairData, updatePairData } from './actions'
import fetchDerivedPriceData, { getTokenBestTvlProtocol } from './fetch/fetchDerivedPriceData'
import fetchPairPriceData from './fetch/fetchPairPriceData'
import { pairHasEnoughLiquidity } from './fetch/utils'
import {
  normalizeChartData,
  normalizeDerivedChartData,
  normalizeDerivedPairDataByActiveToken,
  normalizePairDataByActiveToken,
} from './normalizers'
import { SwapState } from './reducer'
import { derivedPairByDataIdSelector, pairByDataIdSelector } from './selectors'
import { PairDataTimeWindowEnum } from './types'
import { useStableSwapPairs } from './useStableSwapPairs'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

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

// Get swap price for single token disregarding slippage and price impact
export function useSingleTokenSwapInfo(
  inputCurrencyId: string | undefined,
  inputCurrency: Currency | undefined,
  outputCurrencyId: string | undefined,
  outputCurrency: Currency | undefined,
): { [key: string]: number } {
  const token0Address = useMemo(() => getTokenAddress(inputCurrencyId), [inputCurrencyId])
  const token1Address = useMemo(() => getTokenAddress(outputCurrencyId), [outputCurrencyId])

  const amount = useMemo(() => tryParseAmount('1', inputCurrency ?? undefined), [inputCurrency])

  const { trade: bestTradeExactIn } = useBestAMMTrade({
    amount,
    currency: outputCurrency,
    baseCurrency: inputCurrency,
    tradeType: TradeType.EXACT_INPUT,
    maxSplits: 0,
    v2Swap: true,
    v3Swap: true,
    stableSwap: true,
    type: 'quoter',
    autoRevalidate: false,
  })
  if (!inputCurrency || !outputCurrency || !bestTradeExactIn) {
    return null
  }

  let inputTokenPrice: number
  try {
    inputTokenPrice = parseFloat(
      new Price({
        baseAmount: bestTradeExactIn.inputAmount,
        quoteAmount: bestTradeExactIn.outputAmount,
      }).toSignificant(6),
    )
  } catch (error) {
    //
  }
  if (!inputTokenPrice) {
    return null
  }
  const outputTokenPrice = 1 / inputTokenPrice

  return {
    [token0Address]: inputTokenPrice,
    [token1Address]: outputTokenPrice,
  }
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
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
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const to: string | null = (recipient === null ? account : isAddress(recipient) || null) ?? null

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

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
    (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
    (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? t('Invalid recipient')
  }

  const [allowedSlippage] = useUserSlippage()

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

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(
  parsedQs: ParsedUrlQuery,
  nativeSymbol?: string,
  defaultOutputCurrency?: string,
): SwapState {
  let inputCurrency = isAddress(parsedQs.inputCurrency) || (nativeSymbol ?? DEFAULT_INPUT_CURRENCY)
  let outputCurrency =
    typeof parsedQs.outputCurrency === 'string'
      ? isAddress(parsedQs.outputCurrency) || nativeSymbol
      : defaultOutputCurrency ?? DEFAULT_OUTPUT_CURRENCY
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    pairDataById: {},
    derivedPairDataById: {},
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const native = useNativeCurrency()
  const { query, isReady } = useRouter()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId || !native || !isReady) return
    const parsed = queryParametersToSwapState(query, native.symbol, CAKE[chainId]?.address ?? USDC[chainId]?.address)

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      }),
    )
    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
  }, [dispatch, chainId, query, native, isReady])

  return result
}

type useFetchPairPricesParams = {
  token0Address: string
  token1Address: string
  timeWindow: PairDataTimeWindowEnum
  currentSwapPrice: {
    [key: string]: number
  }
}

export const useFetchPairPricesV3 = ({
  token0Address,
  token1Address,
  timeWindow,
  currentSwapPrice,
}: useFetchPairPricesParams) => {
  const { chainId } = useActiveChainId()
  const { data: protocol0 } = useSWRImmutable(
    token0Address && chainId && ['protocol', token0Address, chainId],
    async () => {
      return getTokenBestTvlProtocol(token0Address, chainId)
    },
  )
  const { data: protocol1 } = useSWRImmutable(
    token1Address && chainId && ['protocol', token1Address, chainId],
    async () => {
      return getTokenBestTvlProtocol(token0Address, chainId)
    },
  )

  const {
    data: normalizedDerivedPairData,
    error,
    isLoading,
  } = useSWRImmutable(
    protocol0 &&
      protocol1 &&
      token0Address &&
      chainId &&
      token1Address && ['derivedPrice', { token0Address, token1Address, chainId, protocol0, protocol1, timeWindow }],
    async () => {
      const data = await fetchDerivedPriceData(token0Address, token1Address, timeWindow, protocol0, protocol1, chainId)
      return normalizeDerivedPairDataByActiveToken({
        activeToken: token0Address,
        pairData: normalizeDerivedChartData(data),
      })
    },
    {
      dedupingInterval: SLOW_INTERVAL,
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const hasSwapPrice = currentSwapPrice && currentSwapPrice[token0Address] > 0
  const normalizedDerivedPairDataWithCurrentSwapPrice = useMemo(
    () =>
      normalizedDerivedPairData?.length > 0 && hasSwapPrice
        ? [...normalizedDerivedPairData, { time: new Date(), value: currentSwapPrice[token0Address] }]
        : normalizedDerivedPairData,
    [currentSwapPrice, hasSwapPrice, normalizedDerivedPairData, token0Address],
  )

  return {
    data: normalizedDerivedPairDataWithCurrentSwapPrice,
    error,
    isLoading,
  }
}

export const useFetchPairPrices = ({
  token0Address,
  token1Address,
  timeWindow,
  currentSwapPrice,
}: useFetchPairPricesParams) => {
  const { chainId } = useActiveChainId()
  const [pairId, setPairId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const pairData = useSelector(pairByDataIdSelector({ pairId, timeWindow }))
  const derivedPairData = useSelector(derivedPairByDataIdSelector({ pairId, timeWindow }))
  const dispatch = useDispatch()

  const stableSwapPairs = useStableSwapPairs()
  const stableSwapPair = useMemo(
    () =>
      stableSwapPairs.find(
        (pair) =>
          pair.token0.isToken &&
          pair.token1.isToken &&
          (equalsIgnoreCase(pair.token0.address, token0Address) ||
            equalsIgnoreCase(pair.token0.address, token1Address)) &&
          (equalsIgnoreCase(pair.token1.address, token0Address) ||
            equalsIgnoreCase(pair.token1.address, token1Address)),
      ),
    [stableSwapPairs, token0Address, token1Address],
  )
  const isStableSwap = !!stableSwapPair

  useEffect(() => {
    const fetchDerivedData = async () => {
      console.info(
        '[Price Chart]: Not possible to retrieve price data from single pool, trying to fetch derived prices',
      )
      try {
        // Try to get at least derived data for chart
        // This is used when there is no direct data for pool
        // i.e. when multihops are necessary
        const derivedData = await fetchDerivedPriceData(
          token0Address,
          token1Address,
          timeWindow,
          stableSwapPairs.some(
            (p) =>
              equalsIgnoreCase(p.token0.wrapped.address, token0Address) ||
              equalsIgnoreCase(p.token1.wrapped.address, token0Address),
          )
            ? 'stable'
            : 'v2',
          stableSwapPairs.some(
            (p) =>
              equalsIgnoreCase(p.token0.wrapped.address, token1Address) ||
              equalsIgnoreCase(p.token1.wrapped.address, token1Address),
          )
            ? 'stable'
            : 'v2',
          chainId,
        )
        if (derivedData) {
          const normalizedDerivedData = normalizeDerivedChartData(derivedData)
          dispatch(updateDerivedPairData({ pairData: normalizedDerivedData, pairId, timeWindow }))
        } else {
          dispatch(updateDerivedPairData({ pairData: [], pairId, timeWindow }))
        }
      } catch (error) {
        console.error('Failed to fetch derived prices for chart', error)
        dispatch(updateDerivedPairData({ pairData: [], pairId, timeWindow }))
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAndUpdatePairPrice = async () => {
      setIsLoading(true)
      const { data } = await fetchPairPriceData({ pairId, timeWindow, isStableSwap })
      if (data) {
        // Find out if Liquidity Pool has enough liquidity
        // low liquidity pool might mean that the price is incorrect
        // in that case try to get derived price
        const hasEnoughLiquidity = pairHasEnoughLiquidity(data, timeWindow)
        let pairTokenResults
        if (isStableSwap) {
          pairTokenResults = [[stableSwapPair.token0.wrapped.address], [stableSwapPair.token1.wrapped.address]]
        } else {
          try {
            pairTokenResults = await multicallv2({
              abi: IPancakePairABI,
              calls: [
                {
                  address: pairId,
                  name: 'token0',
                },
                {
                  address: pairId,
                  name: 'token1',
                },
              ],
              options: { requireSuccess: false },
            })
          } catch (error) {
            console.info('Error fetching tokenIds from pair')
          }
        }
        const newPairData =
          (pairTokenResults &&
            pairTokenResults[0]?.[0] &&
            pairTokenResults[1]?.[0] &&
            normalizeChartData(
              data,
              pairTokenResults[0][0].toLowerCase(),
              pairTokenResults[1][0].toLowerCase(),
              timeWindow,
            )) ||
          []

        if (newPairData.length > 0 && hasEnoughLiquidity) {
          dispatch(updatePairData({ pairData: newPairData, pairId, timeWindow }))
          setIsLoading(false)
        } else {
          console.info(`[Price Chart]: Liquidity too low for ${pairId}`)
          dispatch(updatePairData({ pairData: [], pairId, timeWindow }))
          fetchDerivedData()
        }
      } else {
        dispatch(updatePairData({ pairData: [], pairId, timeWindow }))
        fetchDerivedData()
      }
    }

    if (!pairData && !derivedPairData && pairId && !isLoading) {
      fetchAndUpdatePairPrice()
    }
  }, [
    pairId,
    timeWindow,
    pairData,
    currentSwapPrice,
    token0Address,
    token1Address,
    derivedPairData,
    dispatch,
    isLoading,
    isStableSwap,
    stableSwapPair,
    stableSwapPairs,
    chainId,
  ])

  useEffect(() => {
    const updatePairId = () => {
      try {
        const pairAddress = isStableSwap
          ? stableSwapPair?.stableSwapAddress?.toLowerCase()
          : getLpAddress(token0Address, token1Address)?.toLowerCase()
        if (pairAddress !== pairId) {
          setPairId(pairAddress)
        }
      } catch (error) {
        setPairId(null)
      }
    }

    updatePairId()
  }, [token0Address, token1Address, pairId, isStableSwap, stableSwapPair])

  const normalizedPairData = useMemo(
    () => normalizePairDataByActiveToken({ activeToken: token0Address, pairData }),
    [token0Address, pairData],
  )

  const normalizedDerivedPairData = useMemo(
    () => normalizeDerivedPairDataByActiveToken({ activeToken: token0Address, pairData: derivedPairData }),
    [token0Address, derivedPairData],
  )

  const hasSwapPrice = currentSwapPrice && currentSwapPrice[token0Address] > 0

  const normalizedPairDataWithCurrentSwapPrice =
    normalizedPairData?.length > 0 && hasSwapPrice
      ? [...normalizedPairData, { time: new Date(), value: currentSwapPrice[token0Address] }]
      : normalizedPairData

  const normalizedDerivedPairDataWithCurrentSwapPrice =
    normalizedDerivedPairData?.length > 0 && hasSwapPrice
      ? [...normalizedDerivedPairData, { time: new Date(), value: currentSwapPrice[token0Address] }]
      : normalizedDerivedPairData

  const hasNoDirectData = normalizedPairDataWithCurrentSwapPrice && normalizedPairDataWithCurrentSwapPrice?.length === 0
  const hasNoDerivedData =
    normalizedDerivedPairDataWithCurrentSwapPrice && normalizedDerivedPairDataWithCurrentSwapPrice?.length === 0

  // undefined is used for loading

  let pairPrices = hasNoDirectData && hasNoDerivedData ? [] : undefined
  if (normalizedPairDataWithCurrentSwapPrice && normalizedPairDataWithCurrentSwapPrice?.length > 0) {
    pairPrices = normalizedPairDataWithCurrentSwapPrice
  } else if (
    normalizedDerivedPairDataWithCurrentSwapPrice &&
    normalizedDerivedPairDataWithCurrentSwapPrice?.length > 0
  ) {
    pairPrices = normalizedDerivedPairDataWithCurrentSwapPrice
  }
  return { pairPrices, pairId }
}
