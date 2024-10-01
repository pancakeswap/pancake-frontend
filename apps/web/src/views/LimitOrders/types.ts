import { Order } from '@gelatonetwork/limit-orders-lib'

export enum ORDER_CATEGORY {
  Open = 0,
  Expired = 1,
  History = 2,
  Existing = 3,
}

export interface ExistingOrder {
  transactionHash: string
  module: string
  inputToken: string
  owner: string
  witness: string
  data: string
}

export enum LimitOrderStatus {
  OPEN = 'open',
  CANCELLED = 'cancelled',
  EXECUTED = 'executed',
}

export interface LimitOrderTableProps {
  orders: Order[]
  orderCategory: ORDER_CATEGORY
  isCompact: boolean
}
