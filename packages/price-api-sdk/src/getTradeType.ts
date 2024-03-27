import { TradeType } from '@pancakeswap/swap-sdk-core'

export function getTradeType(type: string): TradeType | undefined {
  return TradeType[type as keyof typeof TradeType]
}
