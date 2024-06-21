import { PoolType, usePoolDataQueryV2 } from 'state/info/hooks'
import { type PoolData } from 'state/info/types'
import { useRouterQuery } from './useRouterQuery'

export const usePoolData = (): PoolData | undefined => {
  const { version, pools, chainId } = useRouterQuery()
  const { data: poolData } = usePoolDataQueryV2(pools as string, version as PoolType, chainId)

  return poolData
}
