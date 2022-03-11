import { Order } from '@gelatonetwork/limit-orders-lib'

export enum ORDER_CATEGORY {
  Open = 0,
  History = 1,
}

export interface LimitOrderTableProps {
  orders: Order[]
  orderCategory: ORDER_CATEGORY
  isCompact: boolean
}
