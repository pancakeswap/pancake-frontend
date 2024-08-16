import { useMemo } from 'react'
import { usePoolApr } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { PoolAprButton } from './PoolAprButton'

type PoolGlobalAprButtonProps = {
  pool: PoolInfo
}

export const PoolGlobalAprButton: React.FC<PoolGlobalAprButtonProps> = ({ pool }) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key, pool)

  return (
    <PoolAprButton
      pool={pool}
      lpApr={Number(lpApr ?? 0) ?? 0}
      cakeApr={cakeApr}
      merklApr={Number(merklApr ?? 0) ?? 0}
    />
  )
}
