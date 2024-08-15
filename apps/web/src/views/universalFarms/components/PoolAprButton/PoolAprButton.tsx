import { useModalV2, useTooltip } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { usePoolApr } from 'state/farmsV4/hooks'
import { PoolInfo } from 'state/farmsV4/state/type'
import { StopPropagation } from '../StopPropagation'
import { AprButton } from './AprButton'
import { AprTooltipContent, BCakeWrapperFarmAprTipContent } from './AprTooltipContent'
import { V2PoolAprModal } from './V2PoolAprModal'
import { V3PoolAprModal } from './V3PoolAprModal'

type PoolGlobalAprButtonProps = {
  pool: PoolInfo
}

const sumApr = (...aprs: Array<number | `${number}` | undefined>): number => {
  const sum = aprs.reduce((acc, apr) => {
    if (typeof apr === 'undefined') {
      return acc ?? 0
    }
    return Number(acc ?? 0) + Number(apr ?? 0)
  }, 0)
  return Number(sum) ? Number(sum) : 0
}

export const PoolGlobalAprButton: React.FC<PoolGlobalAprButtonProps> = ({ pool }) => {
  const key = useMemo(() => `${pool.chainId}:${pool.lpAddress}` as const, [pool.chainId, pool.lpAddress])
  const { lpApr, cakeApr, merklApr } = usePoolApr(key, pool)
  const baseApr = useMemo(() => {
    return sumApr(lpApr, cakeApr?.value, merklApr)
  }, [lpApr, cakeApr?.value, merklApr])
  const boostApr = useMemo(() => {
    return sumApr(lpApr, cakeApr?.boost, merklApr)
  }, [cakeApr?.boost, lpApr, merklApr])
  const hasBCake = pool.protocol === 'v2' || pool.protocol === 'stable'

  const modal = useModalV2()

  const { tooltip, targetRef, tooltipVisible } = useTooltip(
    <AprTooltipContent
      combinedApr={boostApr}
      cakeApr={cakeApr}
      lpFeeApr={Number(lpApr) ?? 0}
      merklApr={Number(merklApr) ?? 0}
      showDesc
    >
      {hasBCake ? <BCakeWrapperFarmAprTipContent /> : null}
    </AprTooltipContent>,
  )

  return (
    <StopPropagation>
      <AprButton ref={targetRef} baseApr={baseApr} boostApr={boostApr} onClick={() => modal.setIsOpen(true)} />
      {tooltipVisible && tooltip}
      {hasBCake ? (
        <V2PoolAprModal
          modal={modal}
          poolInfo={pool}
          combinedApr={boostApr}
          lpApr={Number(lpApr ?? 0)}
          boostMultiplier={cakeApr && cakeApr.boost ? Number(cakeApr.boost) / Number(cakeApr.value) : 0}
        />
      ) : (
        <V3PoolAprModal modal={modal} poolInfo={pool} cakeApr={cakeApr} />
      )}
    </StopPropagation>
  )
}
