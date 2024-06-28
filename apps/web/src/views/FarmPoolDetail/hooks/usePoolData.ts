import { usePoolDataQueryV2 } from 'state/info/hooks'
import { type PoolData } from 'state/info/types'
import { useRouterQuery } from './useRouterQuery'

export const usePoolData = (): PoolData | undefined => {
  const { pools, chainId } = useRouterQuery()
  const { data: poolData } = usePoolDataQueryV2(pools as string, chainId)

  return poolData
}
