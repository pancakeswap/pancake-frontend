import { memo } from 'react'
import { useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { usePool, useDeserializedPoolByVaultKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'

import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'
import ExpandRow from './ExpandRow'

export const VaultPoolRow: React.FC<{ vaultKey: VaultKey; account: string }> = memo(({ vaultKey, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpointsContext()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey)

  return (
    <ExpandRow
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} />
      {isXLargerScreen && <AutoEarningsCell pool={pool} account={account} />}
      {isXLargerScreen ? <StakedCell pool={pool} account={account} /> : null}
      <AutoAprCell pool={pool} />
      {isLargerScreen && <TotalStakedCell pool={pool} />}
    </ExpandRow>
  )
})

const PoolRow: React.FC<{ sousId: number; account: string }> = ({ sousId, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isDesktop } = useMatchBreakpointsContext()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool } = usePool(sousId)

  return (
    <ExpandRow
      panel={
        <ActionPanel account={account} pool={pool} expanded breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }} />
      }
    >
      <NameCell pool={pool} />
      <EarningsCell pool={pool} account={account} />
      {isLargerScreen && <TotalStakedCell pool={pool} />}
      <AprCell pool={pool} />
      {isDesktop && <EndsInCell pool={pool} />}
    </ExpandRow>
  )
}

export default memo(PoolRow)
