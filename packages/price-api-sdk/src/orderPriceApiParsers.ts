import { ChainId } from '@pancakeswap/chains'
import { ExclusiveDutchOrder, createExclusiveDutchOrderTrade } from '@pancakeswap/pcsx-sdk'
import { PoolType, V4Router } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, Percent, TradeType, type BigintIsh } from '@pancakeswap/swap-sdk-core'
import { getPoolTypeKey } from './getPoolType'
import { getTradeTypeKey } from './getTradeType'
import {
  AMMPriceResponse,
  ErrorResponse,
  OrderType,
  ResponseType,
  type Request,
  type RequestConfig,
  type Response,
} from './types'

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

export function parseQuoteResponse<input extends Currency, output extends Currency, tradeType = TradeType>(
  res: Response | ErrorResponse,
  {
    chainId,
    currencyOut,
    currencyIn,
    tradeType,
  }: {
    chainId: ChainId
    currencyIn: input
    currencyOut: output
    tradeType: TradeType
  },
) {
  if (res.messageType === ResponseType.ERROR) {
    throw new Error(res.message.error)
  }

  const { bestOrder } = res.message

  if (bestOrder.type === OrderType.PCS_CLASSIC) {
    return V4Router.Transformer.parseTrade(chainId, bestOrder.order)
  }
  if (bestOrder.type === OrderType.DUTCH_LIMIT) {
    const order = ExclusiveDutchOrder.fromJSON(bestOrder.order, chainId)

    return createExclusiveDutchOrderTrade({
      currencyIn,
      currenciesOut: [currencyOut],
      orderInfo: order.info,
      tradeType,
    })
  }

  throw new Error(`Unknown order type`)
}

export function parseAMMPriceResponse(
  chainId: ChainId,
  res: AMMPriceResponse,
): V4Router.V4TradeWithoutGraph<TradeType> & { gasUseEstimateUSD: number } {
  const {
    message: { gasUseEstimateUSD, ...rest },
  } = res
  const trade = V4Router.Transformer.parseTrade(chainId, rest)

  return {
    ...trade,
    gasUseEstimateUSD: Number(gasUseEstimateUSD),
  }
}
