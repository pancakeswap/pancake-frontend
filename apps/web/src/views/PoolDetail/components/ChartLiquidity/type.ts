import { PoolInfo } from 'state/farmsV4/state/type'

export type ChartLiquidityProps = {
  address?: string
  poolInfo?: PoolInfo | null
}

export type V3LiquidityChartData = {
  index: number
  isCurrent: boolean
  activeLiquidity: number
  price0: number
  price1: number
  tvlToken0: number
  tvlToken1: number
}
