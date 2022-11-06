import { Pool } from '@pancakeswap/uikit'
import { memo } from 'react'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Token } from '@pancakeswap/sdk'
import { AprInfo, TotalStaked } from './Stat'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account?: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({ pool, showTotalStaked = true }) => {
  const { stakingToken, totalStaked = BIG_ZERO, userData: poolUserData } = pool

  const stakedBalance = poolUserData?.stakedBalance ? poolUserData.stakedBalance : BIG_ZERO

  return (
    <>
      <AprInfo pool={pool} stakedBalance={stakedBalance} />
      {showTotalStaked && <TotalStaked totalStaked={totalStaked} stakingToken={stakingToken} />}
    </>
  )
}

export default memo(PoolStatsInfo)
