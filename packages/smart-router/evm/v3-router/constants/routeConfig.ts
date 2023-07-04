import { ChainId } from '@pancakeswap/sdk'
import { RouteConfig } from '../types'

export const ROUTE_CONFIG_BY_CHAIN: { [key in ChainId]?: Partial<RouteConfig> } = {
  [ChainId.POLYGON_ZKEVM]: {
    distributionPercent: 20,
  },
}
