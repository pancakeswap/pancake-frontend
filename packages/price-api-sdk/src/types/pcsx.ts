import type { OrderType } from './orderType'

export type XRequestConfig = {
  routingType: OrderType.DUTCH_LIMIT
  useSyntheticQuotes?: boolean
  swapper?: `0x${string}`
  exclusivityOverrideBps?: number
  startTimeBufferSecs?: number
  auctionPeriodSecs?: number
  deadlineBufferSecs?: number
}
