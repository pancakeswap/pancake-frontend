import type { ExclusiveDutchOrderInfoJSON } from '@pancakeswap/pcsx-sdk'
import type { AMMOrder } from './amm'
import type { OrderType } from './orderType'

export type Order =
  | {
      type: OrderType.DUTCH_LIMIT
      order: ExclusiveDutchOrderInfoJSON
    }
  | {
      type: OrderType.PCS_CLASSIC
      order: AMMOrder
    }
