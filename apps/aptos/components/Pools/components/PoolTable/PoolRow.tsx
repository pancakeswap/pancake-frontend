import { memo, useMemo } from 'react'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { TokenPairImage } from 'components/TokenImage'
import _noop from 'lodash/noop'
import Apr from '../PoolCard/Apr'

const ActionPanel = () => 'ActionPanel'

const PoolRow: React.FC<React.PropsWithChildren<{ sousId: number; account: string; initialActivity?: boolean }>> = ({
  account,
  initialActivity,
  pool,
}) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [stakingToken.decimals, totalStaked])

  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <Pool.NameCell<Coin> pool={pool} tokenPairImage={TokenPairImage} />
      <Pool.EarningsCell<Coin> pool={pool} account={account} onPresentCollect={_noop} />
      {isLargerScreen && (
        <Pool.TotalStakedCell
          stakingToken={stakingToken}
          totalStaked={totalStaked}
          totalStakedBalance={totalStakedBalance}
        />
      )}
      <Pool.AprCell<Coin> pool={pool} aprComp={Apr} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
