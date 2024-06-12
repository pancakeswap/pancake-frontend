import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { GRAPH_API_PREDICTION_BNB } from '@pancakeswap/prediction'
import { getPortalRoot } from '@pancakeswap/uikit'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SubgraphHealthIndicator, SubgraphHealthIndicatorProps } from './SubgraphHealthIndicator'

interface FactoryParams {
  getSubgraph: (chainId: ChainId) => string
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function subgraphHealthIndicatorFactory({ getSubgraph }: FactoryParams) {
  return function Indicator(props: PartialBy<SubgraphHealthIndicatorProps, 'subgraph' | 'chainId'>) {
    const { chainId } = useActiveChainId()

    const subgraph = useMemo(() => {
      if (props.chainId) {
        return getSubgraph(props.chainId)
      }
      if (chainId) {
        return getSubgraph(chainId)
      }
      return undefined
    }, [chainId, props?.chainId])

    if (!subgraph) {
      return null
    }

    const portalRoot = getPortalRoot()

    return portalRoot
      ? createPortal(<SubgraphHealthIndicator chainId={chainId} subgraph={subgraph} {...props} />, portalRoot)
      : null
  }
}

export const LotterySubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraph: () => GRAPH_API_LOTTERY,
})

export const PredictionSubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraph: (chainId) => GRAPH_API_PREDICTION_BNB?.[chainId],
})
