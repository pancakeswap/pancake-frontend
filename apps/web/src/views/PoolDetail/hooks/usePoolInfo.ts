import { usePoolInfo } from 'state/farmsV4/hooks'
import type { PoolInfo } from 'state/farmsV4/state/type'
import { useRouterQuery } from './useRouterQuery'

export const usePoolInfoByQuery = (): PoolInfo | undefined | null => {
  const { id, chainId } = useRouterQuery()
  return usePoolInfo({ poolAddress: id as `0x${string}`, chainId })
}
