import { memo } from 'react'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { TokenPairImage } from 'components/TokenImage'
import Apr from '../PoolCard/Apr'
import ActionPanel from './ActionPanel'

const PoolRow: React.FC<
  React.PropsWithChildren<{
    sousId: number
    account?: string
    initialActivity?: boolean
    pool: Pool.DeserializedPool<Coin>
  }>
> = ({ account = '', initialActivity, pool }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { stakingToken, totalStaked, earningToken } = pool

  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <Pool.NameCell<Coin>
        pool={pool}
        tokenPairImage={
          <TokenPairImage mr="8px" width={40} height={40} primaryToken={earningToken} secondaryToken={stakingToken} />
        }
      />
      <Pool.EarningsCell<Coin> pool={pool} account={account} />
      {isLargerScreen && (
        <Pool.TotalStakedCell
          stakingTokenDecimals={stakingToken?.decimals}
          stakingTokenSymbol={stakingToken?.symbol}
          totalStaked={totalStaked}
        />
      )}
      <Pool.AprCell<Coin> pool={pool} aprComp={Apr} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
