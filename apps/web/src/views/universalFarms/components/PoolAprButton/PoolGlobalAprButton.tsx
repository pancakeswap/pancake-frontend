import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { usePoolApr } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useMyPositions } from 'views/PoolDetail/components/MyPositionsContext'
import { PoolAprButton } from './PoolAprButton'

type PoolGlobalAprButtonProps = {
  pool: PoolInfo
  detailMode?: boolean
}

export const PoolGlobalAprButton: React.FC<PoolGlobalAprButtonProps> = ({ pool, detailMode }) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key, pool)
  const numerator = useMemo(() => {
    const lpAprNumerator = new BigNumber(lpApr).times(cakeApr?.userTvlUsd ?? BIG_ZERO)
    return lpAprNumerator
  }, [lpApr, cakeApr?.userTvlUsd])
  const denominator = useMemo(() => {
    return cakeApr?.userTvlUsd ?? BIG_ZERO
  }, [cakeApr?.userTvlUsd])

  const { updateTotalApr } = useMyPositions()

  useEffect(() => {
    if (detailMode && (pool.protocol === 'v2' || pool.protocol === 'stable')) {
      updateTotalApr(key, numerator, denominator)
    }
  }, [cakeApr, denominator, detailMode, key, lpApr, merklApr, numerator, pool.protocol, updateTotalApr])

  return (
    <PoolAprButton pool={pool} lpApr={parseFloat(lpApr) ?? 0} cakeApr={cakeApr} merklApr={parseFloat(merklApr) ?? 0} />
  )
}
