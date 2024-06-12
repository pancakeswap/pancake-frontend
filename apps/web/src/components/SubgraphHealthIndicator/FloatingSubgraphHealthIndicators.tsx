import { ChainId } from '@pancakeswap/chains'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { GRAPH_API_PREDICTION_BNB } from '@pancakeswap/prediction'
import { getPortalRoot } from '@pancakeswap/uikit'
import { GRAPH_API_LOTTERY, THE_GRAPH_PROXY_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { SubgraphHealthIndicator, SubgraphHealthIndicatorProps } from './SubgraphHealthIndicator'

interface FactoryParams {
  getSubgraphName: (chainId: ChainId) => string
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function subgraphHealthIndicatorFactory({ getSubgraphName }: FactoryParams) {
  return function Indicator(props: PartialBy<SubgraphHealthIndicatorProps, 'subgraphName' | 'chainId'>) {
    const { chainId } = useActiveChainId()

    const subgraphName = useMemo(() => {
      if (props.chainId) {
        return getSubgraphName(props.chainId)
      }
      if (chainId) {
        return getSubgraphName(chainId)
      }
      return undefined
    }, [chainId, props?.chainId])

    if (!subgraphName) {
      return null
    }

    const portalRoot = getPortalRoot()

    return portalRoot
      ? createPortal(<SubgraphHealthIndicator chainId={chainId} subgraphName={subgraphName} {...props} />, portalRoot)
      : null
  }
}

export const LotterySubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: () => GRAPH_API_LOTTERY.replace(`${THE_GRAPH_PROXY_API}/`, ''),
})

export const PredictionSubgraphHealthIndicator = subgraphHealthIndicatorFactory({
  getSubgraphName: (chainId) => GRAPH_API_PREDICTION_BNB?.[chainId]?.replace(`${THE_GRAPH_PROXY_API}/`, ''),
})
