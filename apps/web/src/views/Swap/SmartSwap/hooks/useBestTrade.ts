import { useDeferredValue } from 'react'
import useSWR from 'swr'
import { CurrencyAmount, TradeType, Currency, Token, Pair } from '@pancakeswap/sdk'
import { getBestTradeExactIn, getBestTradeExactOut, createStableSwapPair } from '@pancakeswap/smart-router/evm'
import { deserializeToken } from '@pancakeswap/token-lists'

import { laggyMiddleware } from 'hooks/useSWRContract'
import { provider } from 'utils/wagmi'
import { getBestPriceWithRouter, RequestBody } from 'state/swap/fetch/fetchBestPriceWithRouter'

function createUseBestTrade<T>(
  key: string,
  getBestTrade: (amount: CurrencyAmount<Currency>, currency: Currency, tradeType: TradeType) => Promise<T>,
) {
  return function useTrade(
    amount: CurrencyAmount<Currency> | undefined,
    currency: Currency,
    tradeType: TradeType,
  ): T | null {
    const deferQuotient = useDeferredValue(amount?.quotient.toString())

    const { data: trade } = useSWR(
      amount ? [key, 'swap', amount.currency.chainId, amount.currency.symbol, currency.symbol, deferQuotient] : null,
      () => getBestTrade(amount, currency, tradeType),
      {
        use: [laggyMiddleware],
      },
    )
    return trade
  }
}

const isToken = (currency: Currency): currency is Token => {
  // @ts-ignore
  return Boolean(currency?.address)
}

function createRequest(tradeType: TradeType) {
  return function request(amount: CurrencyAmount<Currency>, currency: Currency) {
    const inputCurrency = tradeType === TradeType.EXACT_INPUT ? amount.currency : currency
    const outputCurrency = tradeType === TradeType.EXACT_INPUT ? currency : amount.currency
    const rawAmount = amount.quotient.toString()
    const requestBody: RequestBody = {
      networkId: inputCurrency.chainId,
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
    return getBestPriceWithRouter(requestBody)
  }
}

const getBestTradeExactInFromApi = createRequest(TradeType.EXACT_INPUT)

const getBestTradeExactOutFromApi = createRequest(TradeType.EXACT_OUTPUT)

export const useBestTradeFromChain = createUseBestTrade('tradeFromChain', (amount, currency, tradeType) => {
  const bestTrade = tradeType === TradeType.EXACT_INPUT ? getBestTradeExactIn : getBestTradeExactOut
  return bestTrade(amount, currency, { provider })
})

export const useBestTradeFromApi = createUseBestTrade('tradeFromApi', async (amount, currency, tradeType) => {
  const bestTrade = tradeType === TradeType.EXACT_INPUT ? getBestTradeExactInFromApi : getBestTradeExactOutFromApi
  const data = await bestTrade(amount, currency)
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
})

export function useBestTrade(amount: CurrencyAmount<Currency>, currency: Currency, tradeType: TradeType) {
  const bestTradeFromChain = useBestTradeFromChain(amount, currency, tradeType)
  const bestTradeFromApi = useBestTradeFromApi(amount, currency, tradeType)

  return bestTradeFromApi || bestTradeFromChain
}
