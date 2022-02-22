import { Trade } from '@pancakeswap/sdk'

export enum TAB_TYPE {
  Open = 0,
  History = 1,
}

export interface LimitOrderTableProps {
  isChartDisplayed: boolean
  orders: Trade[]
}
