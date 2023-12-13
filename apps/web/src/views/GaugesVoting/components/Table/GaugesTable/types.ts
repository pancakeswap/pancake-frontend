import { Gauge } from '@pancakeswap/gauges'

export type RowData = Gauge & { locked?: boolean }
