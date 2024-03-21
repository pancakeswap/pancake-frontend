import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { GRAPH_API_PREDICTION_BNB } from '@pancakeswap/prediction'
import { GRAPH_API_LOTTERY, V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getPortalRoot } from '@pancakeswap/uikit'
import { SubgraphHealthIndicator, SubgraphHealthIndicatorProps } from './SubgraphHealthIndicator'

interface FactoryParams {
  getSubgraphName: (chainId: ChainId) => string
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function subgraphHealthIndicatorFactory({ getSubgraphName }: FactoryParams) {
  return function Indicator(props: PartialBy<SubgraphHealthIndicatorProps, 'subgraphName' | 'chainId'>) {
    const { chainId } = useActiveChainId()
    const subgraphName = useMemo(() => chainId && getSubgraphName(chainId), [chainId])

    if (!subgraphName) {
      return null
    }

    const portalRoot = getPortalRoot()

    return portalRoot
      ? createPortal(<SubgraphHealthIndicator chainId={chainId} subgraphName={subgraphName} {...props} />, portalRoot)
      : null
  }
}

export const V3SubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: (chainId) => {
    if (V3_SUBGRAPH_URLS[chainId]?.startsWith('https://api.thegraph.com/subgraphs/name/')) {
      return V3_SUBGRAPH_URLS?.[chainId]?.replace('https://api.thegraph.com/subgraphs/name/', '') || ''
    }
    return ''
  },
})

export const LotterySubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: () => GRAPH_API_LOTTERY.replace('https://api.thegraph.com/subgraphs/name/', ''),
})

export const PredictionSubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: (chainId) =>
    GRAPH_API_PREDICTION_BNB?.[chainId]?.replace('https://api.thegraph.com/subgraphs/name/', ''),
})
