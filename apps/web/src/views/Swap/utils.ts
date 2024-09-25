import { ChainId } from '@pancakeswap/chains'
import { ClassicOrder, OrderType, PriceOrder, XOrder } from '@pancakeswap/price-api-sdk'
import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'

export const TWAP_SUPPORTED_CHAINS = [ChainId.BSC]

export const isTwapSupported = (chainId?: ChainId) => {
  return !chainId ? false : TWAP_SUPPORTED_CHAINS.includes(chainId)
}

export const isXOrder = (order: InterfaceOrder | undefined | null): order is XOrder =>
  order?.type === OrderType.DUTCH_LIMIT

export const isClassicOrder = (order: InterfaceOrder | undefined | null): order is ClassicOrder =>
  order?.type === OrderType.PCS_CLASSIC

export type InterfaceOrder<
  input extends Currency = Currency,
  output extends Currency = Currency,
  tradeType extends TradeType = TradeType,
> = PriceOrder<input, output, tradeType>
