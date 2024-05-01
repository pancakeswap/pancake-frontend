import { ChainId } from '@pancakeswap/chains'
import { ClassicOrder, OrderType, PriceOrder, XOrder } from '@pancakeswap/price-api-sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'
import { MMCommitTrade } from './V3Swap/types'

export const TWAP_SUPPORTED_CHAINS = [ChainId.BSC]

export const isTwapSupported = (chainId?: ChainId) => {
  return !chainId ? false : TWAP_SUPPORTED_CHAINS.includes(chainId)
}

export type MMOrder = {
  type: 'MM'
  trade: SmartRouterTrade<TradeType> | V4Router.V4Trade<TradeType>
} & MMCommitTrade<SmartRouterTrade<TradeType>>

export const isXOrder = (order: InterfaceOrder | undefined | null): order is XOrder =>
  order?.type === OrderType.DUTCH_LIMIT

export const isMMOrder = (order: InterfaceOrder | undefined | null): order is MMOrder => order?.type === 'MM'

export const isClassicOrder = (order: InterfaceOrder | undefined | null): order is ClassicOrder =>
  order?.type === OrderType.PCS_CLASSIC

export type InterfaceOrder<
  input extends Currency = Currency,
  output extends Currency = Currency,
  tradeType extends TradeType = TradeType,
> = MMOrder | PriceOrder<input, output, tradeType>
