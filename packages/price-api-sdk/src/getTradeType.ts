import { TradeType } from '@pancakeswap/swap-sdk-core'

import type { TradeTypeKey } from './types'

export function getTradeTypeByKey(type: string): TradeType | undefined {
  return TradeType[type as keyof typeof TradeType]
}

export function getTradeTypeKey(tradeType: TradeType): TradeTypeKey {
  for (const [key, value] of Object.entries(TradeType)) {
    if (value === tradeType) {
      return key as TradeTypeKey
    }
  }
  throw new Error(`Invalid trade type: ${tradeType}`)
}
