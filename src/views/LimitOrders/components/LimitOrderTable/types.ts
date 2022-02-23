import { Order } from '@gelatonetwork/limit-orders-lib'

export enum TAB_TYPE {
  Open = 0,
  History = 1,
}

export interface LimitOrderTableProps {
  isChartDisplayed: boolean
  orders: Order[]
}
