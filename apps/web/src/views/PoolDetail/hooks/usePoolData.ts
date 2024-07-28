import { usePoolDataQueryV2 } from 'state/info/hooks'
import { type PoolData } from 'state/info/types'
import { useRouterQuery } from './useRouterQuery'

export const usePoolData = (): PoolData | undefined => {
  const { id, chainId } = useRouterQuery()
  const { data: poolData } = usePoolDataQueryV2(id, chainId)

  return poolData
}
