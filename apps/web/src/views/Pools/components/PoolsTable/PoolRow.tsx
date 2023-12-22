import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Pool } from '@pancakeswap/widgets-internal'
import { memo, useCallback, useMemo } from 'react'
import { useDeserializedPoolByVaultKey, usePool, useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { VeCakeBenefitCard } from 'views/CakeStaking/components/SyrupPool/VeCakeCard'

import { Token } from '@pancakeswap/swap-sdk-core'
import styled from 'styled-components'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import ActionPanel from './ActionPanel/ActionPanel'
import AprCell from './Cells/AprCell'
import AutoAprCell from './Cells/AutoAprCell'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import EarningsCell from './Cells/EarningsCell'
import NameCell from './Cells/NameCell'
import StakedCell from './Cells/StakedCell'
import TotalStakedCell from './Cells/TotalStakedCell'

const MigrateCell = styled(Pool.BaseCell)`
  padding: 0;
  justify-content: center;
  flex: 7.5;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-grow: 1;
  }
`

export const VaultPoolRow: React.FC<
  React.PropsWithChildren<{ vaultKey: VaultKey; account: string; initialActivity?: boolean }>
> = memo(({ vaultKey, account, initialActivity }) => {
  const { isLg, isXl, isXxl, isMobile } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey) as Pool.DeserializedPoolLockedVault<Token>
  const { totalCakeInVault } = useVaultPoolByKey(vaultKey)
  const isUserDelegated = useIsUserDelegated()

  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
  }, [stakingToken.decimals, totalCakeInVault])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      {!account || isUserDelegated ? (
        <MigrateCell>
          {isMobile ? (
            <Text fontSize={14} lineHeight="14px">
              This product have been upgraded!
            </Text>
          ) : (
            <VeCakeBenefitCard isTableView />
          )}
        </MigrateCell>
      ) : null}
      {account && !isUserDelegated && (
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
