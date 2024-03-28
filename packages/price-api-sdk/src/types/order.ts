import type { AMMOrder } from './amm'
import type { OrderType } from './orderType'
import type { DutchLimitOrder } from './pcsx'

export type Order = {
  type: OrderType
  order: DutchLimitOrder | AMMOrder
}
