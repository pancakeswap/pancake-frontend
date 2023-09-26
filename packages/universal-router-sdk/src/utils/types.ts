import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'

export type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[]
