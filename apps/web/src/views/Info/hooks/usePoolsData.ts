import { useMemo } from 'react'
import { checkIsStableSwap } from 'state/info/constant'
import { useAllPoolDataSWR, useStableSwapTopPoolsAPR } from 'state/info/hooks'

export const usePoolsData = () => {
  const isStableSwap = checkIsStableSwap()

  // get all the pool datas that exist
  const allPoolData = useAllPoolDataSWR()

  const poolAddresses = useMemo(() => {
    return Object.keys(allPoolData)
  }, [allPoolData])

  const stableSwapsAprs = useStableSwapTopPoolsAPR(poolAddresses)
  // get all the pool datas that exist
  const poolsData = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => {
        return {
          ...pool.data,
          ...(isStableSwap && stableSwapsAprs && { lpApr7d: stableSwapsAprs[pool.data.address] }),
        }
      })
      .filter((pool) => pool.token1.name !== 'unknown' && pool.token0.name !== 'unknown')
  }, [allPoolData, isStableSwap, stableSwapsAprs])
  return { poolsData, stableSwapsAprs }
}
