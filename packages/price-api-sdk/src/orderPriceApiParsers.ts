import { type BigintIsh, Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/swap-sdk-core'
import { PoolType } from '@pancakeswap/smart-router'

import { OrderType, type Request, type RequestConfig } from './types'
import { getTradeTypeKey } from './getTradeType'
import { getPoolTypeKey } from './getPoolType'

type RequestInputs = {
  amount: CurrencyAmount<Currency>
  quoteCurrency: Currency
  tradeType: TradeType
  slippage?: Percent
  amm?: {
    poolTypes?: PoolType[]
    maxHops?: number
    maxSplits?: number
    gasPriceWei?: BigintIsh
  }
  x?: {
    useSyntheticQuotes?: boolean
    swapper?: `0x${string}`
    exclusivityOverrideBps?: number
    startTimeBufferSecs?: number
    auctionPeriodSecs?: number
    deadlineBufferSecs?: number
  }
}

const getCurrencyIdentifier = (currency: Currency) => (currency.isNative ? currency.symbol : currency.wrapped.address)

export function getRequestBody({ amount, quoteCurrency, tradeType, amm, x }: RequestInputs): Request {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT ? [amount.currency, quoteCurrency] : [quoteCurrency, amount.currency]
  const configs: RequestConfig[] = []

  if (amm) {
    configs.push({
      protocols: amm.poolTypes?.map(getPoolTypeKey) || ['V2', 'V3', 'STABLE'],
      routingType: OrderType.PCS_CLASSIC,
      gasPriceWei: amm.gasPriceWei?.toString(),
      maxHops: amm.maxHops,
      maxSplits: amm.maxSplits,
    })
  }

  if (x) {
    configs.push({
      routingType: OrderType.DUTCH_LIMIT,
      ...x,
    })
  }

  return {
    amount: amount.quotient.toString(),
    type: getTradeTypeKey(tradeType),
    tokenInChainId: currencyIn.chainId,
    tokenOutChainId: currencyOut.chainId,
    tokenIn: getCurrencyIdentifier(currencyIn),
    tokenOut: getCurrencyIdentifier(currencyOut),
    configs,
  }
}
