import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo } from 'react'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useDeserializedPoolByVaultKey, usePool, useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { VeCakeBenefitCard } from 'views/CakeStaking/components/SyrupPool/VeCakeCard'

import ActionPanel from './ActionPanel/ActionPanel'
import AprCell from './Cells/AprCell'
import AutoAprCell from './Cells/AutoAprCell'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import EarningsCell from './Cells/EarningsCell'
import NameCell from './Cells/NameCell'
import StakedCell from './Cells/StakedCell'
import TotalStakedCell from './Cells/TotalStakedCell'

export const VaultPoolRow: React.FC<
  React.PropsWithChildren<{ vaultKey: VaultKey; account: string; initialActivity?: boolean }>
> = memo(({ vaultKey, account, initialActivity }) => {
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey)
  const { totalCakeInVault } = useVaultPoolByKey(vaultKey)

  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
  }, [stakingToken.decimals, totalCakeInVault])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      <Pool.BaseCell style={{ padding: 0, justifyContent: 'center', flexGrow: 1 }}>
        {!account && <VeCakeBenefitCard isTableView />}
      </Pool.BaseCell>
      {account && (
        <>
          {isXLargerScreen && <AutoEarningsCell pool={pool} account={account} />}
          {isXLargerScreen ? <StakedCell pool={pool} account={account} /> : null}
          <AutoAprCell pool={pool} />
          {isLargerScreen && (
            <TotalStakedCell
              stakingToken={stakingToken}
              totalStaked={totalStaked}
              totalStakedBalance={totalStakedBalance}
            />
          )}
        </>
      )}
    </Pool.ExpandRow>
  )
})

const PoolRow: React.FC<React.PropsWithChildren<{ sousId: number; account: string; initialActivity?: boolean }>> = ({
  sousId,
  account,
  initialActivity,
}) => {
  const { isLg, isXl, isXxl, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool } = usePool(sousId)
  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [stakingToken.decimals, totalStaked])

  const getNow = useCallback(() => Date.now(), [])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      <EarningsCell pool={pool} account={account} />
      {isLargerScreen && (
        <TotalStakedCell
          stakingToken={stakingToken}
          totalStaked={totalStaked}
          totalStakedBalance={totalStakedBalance}
        />
      )}
      <AprCell pool={pool} />
      {isDesktop && <Pool.EndsInCell pool={pool} getNow={getNow} />}
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
