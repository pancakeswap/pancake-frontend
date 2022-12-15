import { useDeferredValue } from 'react'
import useSWR from 'swr'
import { CurrencyAmount, TradeType, Currency, Pair } from '@pancakeswap/sdk'
import { getBestTradeExactIn, getBestTradeExactOut, createStableSwapPair } from '@pancakeswap/smart-router/evm'
import { deserializeToken } from '@pancakeswap/token-lists'
import { getAddress } from '@ethersproject/address'

import { useAllCommonPairs } from 'hooks/Trades'
import { provider } from 'utils/wagmi'
import { getBestPriceWithRouter, RequestBody } from 'state/swap/fetch/fetchBestPriceWithRouter'

const NATIVE_CURRENCY_ADDRESS = getAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

interface TradeOptions {
  trader?: string
  amount: CurrencyAmount<Currency>
  currency: Currency
  tradeType: TradeType
  allCommonPairs: Pair[]
  maxHops?: number
}

interface UseTradeOptions {
  maxHops?: number
}

function createUseBestTrade<T>(key: string, getBestTrade: (options: TradeOptions) => Promise<T>) {
  return function useTrade(
    amount: CurrencyAmount<Currency> | undefined,
    currency: Currency,
    tradeType: TradeType,
    { maxHops = 3 }: UseTradeOptions = {},
  ): T | null {
    const allCommonPairs = useAllCommonPairs(amount?.currency, currency)
    const deferQuotient = useDeferredValue(amount?.quotient.toString())

    const { data: trade } = useSWR(
      amount
        ? [
            key,
            'swap',
            tradeType,
            amount.currency.chainId,
            amount.currency.symbol,
            currency.symbol,
            deferQuotient,
            maxHops,
            allCommonPairs,
          ]
        : null,
      // TODO: trader should use user Wallet address
      () => getBestTrade({ amount, currency, tradeType, allCommonPairs, trader: '', maxHops }),
      {
        keepPreviousData: true,
      },
    )
    return trade
  }
}

function createRequest(tradeType: TradeType) {
  return function request(amount: CurrencyAmount<Currency>, currency: Currency, trader: string) {
    const inputCurrency = tradeType === TradeType.EXACT_INPUT ? amount.currency : currency
    const outputCurrency = tradeType === TradeType.EXACT_INPUT ? currency : amount.currency
    const rawAmount = amount.quotient.toString()
    const requestBody: RequestBody = {
      networkId: inputCurrency.chainId,
      baseToken: inputCurrency.isToken ? inputCurrency.address : NATIVE_CURRENCY_ADDRESS,
      baseTokenName: inputCurrency?.name,
      baseTokenAmount: tradeType === TradeType.EXACT_INPUT ? rawAmount : undefined,
      baseTokenNumDecimals: inputCurrency?.decimals,
      quoteToken: outputCurrency.isToken ? outputCurrency.address : NATIVE_CURRENCY_ADDRESS,
      quoteTokenAmount: tradeType === TradeType.EXACT_OUTPUT ? rawAmount : undefined,
      quoteTokenName: outputCurrency?.name,
      quoteTokenNumDecimals: outputCurrency?.decimals,
      trader,
    }
    return getBestPriceWithRouter(requestBody)
  }
}

const getBestTradeExactInFromApi = createRequest(TradeType.EXACT_INPUT)

const getBestTradeExactOutFromApi = createRequest(TradeType.EXACT_OUTPUT)

export const useBestTradeFromChain = createUseBestTrade(
  'tradeFromChain',
  async ({ amount, currency, tradeType, allCommonPairs, maxHops }) => {
    const bestTrade = tradeType === TradeType.EXACT_INPUT ? getBestTradeExactIn : getBestTradeExactOut
    return bestTrade(amount, currency, { provider, allCommonPairs, maxHops })
  },
)

export const useBestTradeFromApi = createUseBestTrade(
  'tradeFromApi',
  async ({ amount, currency, tradeType, trader }) => {
    const bestTrade = tradeType === TradeType.EXACT_INPUT ? getBestTradeExactInFromApi : getBestTradeExactOutFromApi
    const data = await bestTrade(amount, currency, trader)
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
  },
)

export function useBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  options?: UseTradeOptions,
) {
  const bestTradeFromChain = useBestTradeFromChain(amount, currency, tradeType, options)
  // Remove source from api for now until api is optimized
  // const bestTradeFromApi = useBestTradeFromApi(amount, currency, tradeType)

  // return bestTradeFromApi || bestTradeFromChain
  return bestTradeFromChain
}
