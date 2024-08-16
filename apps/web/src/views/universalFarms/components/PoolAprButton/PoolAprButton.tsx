import { useModalV2, useTooltip } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { CakeApr } from 'state/farmsV4/atom'
import { ChainIdAddressKey, PoolInfo } from 'state/farmsV4/state/type'
import { sumApr } from '../../utils/sumApr'
import { StopPropagation } from '../StopPropagation'
import { AprButton } from './AprButton'
import { AprTooltipContent, BCakeWrapperFarmAprTipContent } from './AprTooltipContent'
import { V2PoolAprModal } from './V2PoolAprModal'
import { V3PoolAprModal } from './V3PoolAprModal'

type PoolGlobalAprButtonProps = {
  pool: PoolInfo
  lpApr: number
  cakeApr: CakeApr[ChainIdAddressKey]
  merklApr?: number
}

export const PoolAprButton: React.FC<PoolGlobalAprButtonProps> = ({ pool, lpApr, cakeApr, merklApr }) => {
  const baseApr = useMemo(() => {
    return sumApr(lpApr, cakeApr?.value, merklApr)
  }, [lpApr, cakeApr?.value, merklApr])
  const boostApr = useMemo(() => {
    return typeof cakeApr?.boost !== 'undefined' ? sumApr(lpApr, cakeApr?.boost, merklApr) : undefined
  }, [cakeApr?.boost, lpApr, merklApr])
  const hasBCake = pool.protocol === 'v2' || pool.protocol === 'stable'

  const modal = useModalV2()

  const { tooltip, targetRef, tooltipVisible } = useTooltip(
    <AprTooltipContent
      combinedApr={boostApr ?? baseApr}
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
          combinedApr={boostApr ?? baseApr}
          lpApr={Number(lpApr ?? 0)}
          boostMultiplier={cakeApr && cakeApr.boost ? Number(cakeApr.boost) / Number(cakeApr.value) : 0}
        />
      ) : (
        <V3PoolAprModal modal={modal} poolInfo={pool} cakeApr={cakeApr} />
      )}
    </StopPropagation>
  )
}
