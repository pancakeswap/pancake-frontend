import { ChainId } from '@pancakeswap/chains'

import { AMMOrder, AMMRequestConfig, TradeTypeKey } from './amm'
import { Order } from './order'
import { XRequestConfig } from './pcsx'

export enum ResponseType {
  PRICE_RESPONSE = 'PRICE_RESPONSE',
  MM_PRICE_RESPONSE = 'MM_PRICE_RESPONSE',
  DUTCH_LIMIT_RESPONSE = 'DUTCH_LIMIT_RESPONSE',
  AMM_PRICE_RESPONSE = 'AMM_PRICE_RESPONSE',
  ERROR = 'ERROR',
}

export type ErrorResponse = {
  messageType: ResponseType.ERROR
  message: {
    error: string
    causes?: unknown
  }
}

export type RequestConfig = AMMRequestConfig | XRequestConfig

export type Request = {
  type: TradeTypeKey
  amount: string
  tokenInChainId: ChainId
  tokenIn: string
  tokenOutChainId: ChainId
  tokenOut: string
  configs: RequestConfig[]
  slippageTolerance?: string
}

export type PriceResponse = {
  messageType: ResponseType.PRICE_RESPONSE
  message: {
    bestOrder: Order
    allPossibleOrders: Order[]
  }
}

export type AMMPriceResponse = {
  messageType: ResponseType.AMM_PRICE_RESPONSE
  message: AMMOrder
}
