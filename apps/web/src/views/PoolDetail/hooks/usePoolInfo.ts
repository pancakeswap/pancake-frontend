import { useQuery } from '@tanstack/react-query'
import { fetchExplorerPoolInfo } from 'state/farmsV4/state/extendPools/fetcher'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useRouterQuery } from './useRouterQuery'

export const usePoolInfo = (): PoolInfo | undefined | null => {
  const { id, chainId } = useRouterQuery()
  const { data: poolInfo } = useQuery({
    queryKey: ['poolInfo', chainId, id],
    queryFn: () => fetchExplorerPoolInfo(id, chainId),
    enabled: !!id && !!chainId,
  })

  return poolInfo
}
