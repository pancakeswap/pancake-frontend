import { useTranslation } from '@pancakeswap/localization'
import { Currency, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useQuery } from '@tanstack/react-query'
import { MutableRefObject, useMemo, useRef } from 'react'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'

import { safeGetAddress } from 'utils'

import { UnsafeCurrency } from 'config/constants/types'
import { useAccount } from 'wagmi'
import { useMMLinkedPoolByDefault } from 'state/user/smartRouter'
import { getMMOrderBook } from '../apis'
import { MMOrderBookTrade, OrderBookRequest, OrderBookResponse } from '../types'
import { parseMMTrade } from '../utils/exchange'
import { useIsMMQuotingPair } from './useIsMMQuotingPair'
import { useMMParam } from './useMMParam'

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

function involvesAddress(trade: SmartRouterTrade<TradeType>, checksummedAddress: string): boolean {
  return trade.routes[0].path.some((token) => token.isToken && token.address === checksummedAddress)
}

// export const useOrderBookQuote = (request: OrderBookRequest | null): OrderBookResponse => {
//   const { data } = useSWR(
//     request &&
//       request.trader &&
//       (request.makerSideTokenAmount || request.takerSideTokenAmount) &&
//       request.makerSideTokenAmount !== '0' &&
//       request.takerSideTokenAmount !== '0' && [
//         `orderBook/${request.networkId}/${request.makerSideToken}/${request.takerSideToken}/${request.makerSideTokenAmount}/${request.takerSideTokenAmount}/`,
//       ],
//     () => {
//       return getMMOrderBook(request)
//     },
//     { refreshInterval: 5000 },
//   )
//   return data
// }

const checkOrderBookShouldRefetch = (
  rfqInputPath: string,
  rfqUserInputPath: MutableRefObject<string>,
  isRFQLive: MutableRefObject<boolean>,
) => {
  // if there is RFQ response and same input should stop refetch orderbook temporarily
  const shouldRefetch = !(
    Boolean(isRFQLive?.current) &&
    Boolean(rfqInputPath === rfqUserInputPath?.current && rfqUserInputPath?.current !== undefined)
  )
  return shouldRefetch
}

export const useOrderBookQuote = (
  request: OrderBookRequest | null,
  rfqRequest: OrderBookRequest | null,
  rfqUserInputPath: MutableRefObject<string>,
  isRFQLive: MutableRefObject<boolean>,
): { data?: OrderBookResponse; isLoading: boolean } => {
  const [isMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const inputPath = `${request?.networkId}/${request?.makerSideToken}/${request?.takerSideToken}/${request?.makerSideTokenAmount}/${request?.takerSideTokenAmount}`
  const rfqInputPath = `${rfqRequest?.networkId}/${rfqRequest?.makerSideToken}/${rfqRequest?.takerSideToken}/${rfqRequest?.makerSideTokenAmount}/${rfqRequest?.takerSideTokenAmount}`
  const enabled = Boolean(
    isMMLinkedPoolByDefault &&
      request &&
      request.trader &&
      (request.makerSideTokenAmount || request.takerSideTokenAmount) &&
      request.makerSideTokenAmount !== '0' &&
      request.takerSideTokenAmount !== '0' &&
      checkOrderBookShouldRefetch(rfqInputPath, rfqUserInputPath, isRFQLive),
  )
  const { data, isPending } = useQuery({
    queryKey: [`orderBook/${inputPath}`],
    queryFn: () => getMMOrderBook(request as OrderBookRequest),
    refetchInterval: 5000,
    enabled,
  })
  return { data: isMMLinkedPoolByDefault ? data : undefined, isLoading: enabled && isPending }
}

export const useMMTrade = (
  independentField: Field,
  typedValue: string,
  inputCurrency: UnsafeCurrency,
  outputCurrency: UnsafeCurrency,
): MMOrderBookTrade<SmartRouterTrade<TradeType>> => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const rfqUserInputPath = useRef<string>('')
  const isRFQLive = useRef<boolean>(false)
  const isMMQuotingPair = useIsMMQuotingPair(inputCurrency, outputCurrency)
  const mmParam = useMMParam(
    isMMQuotingPair,
    independentField,
    typedValue as `${number}`,
    inputCurrency,
    outputCurrency,
  )
  const mmRFQParam = useMMParam(
    isMMQuotingPair,
    independentField,
    typedValue as `${number}`,
    inputCurrency,
    outputCurrency,
    true,
  )

  const { data: mmQuote, isLoading } = useOrderBookQuote(mmParam, mmRFQParam, rfqUserInputPath, isRFQLive)
  const to: string | null = account ?? null

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  )
  const isExactIn = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const parsedAmount = useMemo(() => {
    return tryParseAmount(typedValue, independentCurrency ?? undefined)
  }, [typedValue, independentCurrency])
  const bestTradeWithMM = useMemo(() => {
    if (!inputCurrency || !outputCurrency || !mmQuote || !mmQuote?.message?.takerSideTokenAmount) return null

    const { takerSideTokenAmount, makerSideTokenAmount } = mmQuote?.message || {}
    return parseMMTrade(isExactIn, inputCurrency, outputCurrency, takerSideTokenAmount, makerSideTokenAmount)
  }, [inputCurrency, isExactIn, mmQuote, outputCurrency])

  const currencyBalances = useMemo(() => {
    return {
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }
  }, [relevantTokenBalances])
  const currencies: { [field in Field]?: Currency } = useMemo(() => {
    return {
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }
  }, [inputCurrency, outputCurrency])

  const slippageAdjustedAmounts = useMemo(() => {
    return (
      bestTradeWithMM && {
        [Field.INPUT]: bestTradeWithMM.inputAmount,
        [Field.OUTPUT]: bestTradeWithMM.outputAmount,
      }
    )
  }, [bestTradeWithMM])

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = useMemo(
    () => [currencyBalances[Field.INPUT], slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null],
    [currencyBalances, slippageAdjustedAmounts],
  )

  const inputError = useMemo(() => {
    let result: string | undefined
    if (!account) {
      result = t('Connect Wallet')
    }

    if (!parsedAmount) {
      result = result ?? t('Enter an amount')
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      result = result ?? t('Select a token')
    }

    const formattedTo = safeGetAddress(to)
    if (!to || !formattedTo) {
      result = result ?? t('Enter a recipient')
    } else if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeWithMM && involvesAddress(bestTradeWithMM, formattedTo))
    ) {
      result = result ?? t('Invalid recipient')
    }

    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
      result = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
    }
    if (mmQuote?.message?.error) {
      result = mmQuote?.message?.error
    }
    return result
  }, [account, amountIn, balanceIn, bestTradeWithMM, currencies, mmQuote?.message?.error, parsedAmount, t, to])

  return useMemo<MMOrderBookTrade<SmartRouterTrade<TradeType>>>(() => {
    return {
      trade: bestTradeWithMM,
      parsedAmount,
      currencyBalances,
      currencies,
      inputError,
      mmParam: mmRFQParam,
      rfqUserInputPath,
      isRFQLive,
      isLoading,
    }
  }, [bestTradeWithMM, currencies, currencyBalances, inputError, isLoading, mmRFQParam, parsedAmount])
}
