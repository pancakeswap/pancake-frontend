import { useTranslation } from '@pancakeswap/localization'
import { Currency, Pair, TradeType } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useQuery } from '@tanstack/react-query'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { MutableRefObject, useMemo, useRef } from 'react'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'

import { isAddress } from 'utils'

import { getMMOrderBook } from '../apis'
import { MMOrderBookTrade, OrderBookRequest, OrderBookResponse, TradeWithMM } from '../types'
import { parseMMTrade } from '../utils/exchange'
import { useMMParam } from './useMMParam'
import { useIsMMQuotingPair } from './useIsMMQuotingPair'

// TODO: update
const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // v2 router 02
]

function involvesAddress(trade: TradeWithMM<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.isToken && token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => (pair as Pair)?.liquidityToken?.address === checksummedAddress)
  )
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
  isMMQuotingPair: boolean,
): { data: OrderBookResponse; isLoading: boolean } => {
  const [isMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const inputPath = `${request?.networkId}/${request?.makerSideToken}/${request?.takerSideToken}/${request?.makerSideTokenAmount}/${request?.takerSideTokenAmount}`
  const rfqInputPath = `${rfqRequest?.networkId}/${rfqRequest?.makerSideToken}/${rfqRequest?.takerSideToken}/${rfqRequest?.makerSideTokenAmount}/${rfqRequest?.takerSideTokenAmount}`
  const enabled = Boolean(
    isMMLinkedPoolByDefault &&
      isMMQuotingPair &&
      request &&
      request.trader &&
      (request.makerSideTokenAmount || request.takerSideTokenAmount) &&
      request.makerSideTokenAmount !== '0' &&
      request.takerSideTokenAmount !== '0' &&
      checkOrderBookShouldRefetch(rfqInputPath, rfqUserInputPath, isRFQLive),
  )
  const { data, isLoading } = useQuery([`orderBook/${inputPath}`], () => getMMOrderBook(request), {
    refetchInterval: 5000,
    enabled,
  })
  return { data, isLoading: enabled && isLoading }
}

export const useMMTrade = (
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
): MMOrderBookTrade | null => {
  const { account } = useActiveWeb3React()
  const rfqUserInputPath = useRef<string>('')
  const isRFQLive = useRef<boolean>(false)
  const isMMQuotingPair = useIsMMQuotingPair(inputCurrency, outputCurrency)
  const mmParam = useMMParam(independentField, typedValue, inputCurrency, outputCurrency)
  const mmRFQParam = useMMParam(independentField, typedValue, inputCurrency, outputCurrency, true)

  const { data: mmQuote, isLoading } = useOrderBookQuote(
    mmParam,
    mmRFQParam,
    rfqUserInputPath,
    isRFQLive,
    isMMQuotingPair,
  )
  const { t } = useTranslation()
  const to: string | null = account ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const isExactIn: boolean = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const parsedAmount = useMemo(() => {
    return tryParseAmount(typedValue, independentCurrency ?? undefined)
  }, [typedValue, independentCurrency])
  const bestTradeWithMM = useMemo(() => {
    let result
    if (!inputCurrency || !outputCurrency || !mmQuote || !mmQuote?.message?.takerSideTokenAmount) result = null
    else {
      const { takerSideTokenAmount, makerSideTokenAmount } = mmQuote?.message
      result = parseMMTrade(isExactIn, inputCurrency, outputCurrency, takerSideTokenAmount, makerSideTokenAmount)
    }
    return result
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
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

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

    const formattedTo = isAddress(to)
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

  return useMemo(() => {
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
