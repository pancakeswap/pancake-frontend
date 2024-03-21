import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { AptRewardTooltip } from 'components/Pools/components/PoolTable/AptRewardTooltip'
import { UsUserAptRewardTooltips } from 'components/Pools/components/PoolTable/UsUserAptRewardTooltips'
import { TokenPairImage } from 'components/TokenImage'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { memo } from 'react'
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
  const getNow = useLedgerTimestamp()
  const { isLg, isXl, isXxl } = useMatchBreakpoints()

  const isLargerScreen = isLg || isXl || isXxl
  const { stakingToken, totalStaked, earningToken } = pool

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <Pool.NameCell<Coin>
        pool={pool}
        tokenPairImage={
          <TokenPairImage
            mr="8px"
            width={40}
            height={40}
            style={{ minWidth: 40 }}
            primaryToken={earningToken}
            secondaryToken={stakingToken}
          />
        }
        tooltipComponent={<AptRewardTooltip pool={pool} />}
      />
      <Pool.EarningsCell<Coin>
        pool={pool}
        account={account}
        aptosRewardTooltips={<UsUserAptRewardTooltips pool={pool} />}
      />
      {isLargerScreen && (
        <Pool.TotalStakedCell
          stakingTokenDecimals={stakingToken?.decimals}
          stakingTokenSymbol={stakingToken?.symbol}
          totalStaked={totalStaked}
        />
      )}
      <Pool.AprCell<Coin> pool={pool} aprComp={Apr} />
      {isLargerScreen && <Pool.EndsInCell<Coin> pool={pool} getNow={getNow} />}
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
