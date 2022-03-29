import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import NameCell from 'views/Pools/components/PoolsTable/Cells/NameCell'
import AprCell from 'views/Pools/components/PoolsTable/Cells/AprCell'
import AutoAprCell from 'views/Pools/components/PoolsTable/Cells/AutoAprCell'
import ActionPanel from 'views/Pools/components/PoolsTable/ActionPanel/ActionPanel'
import ExpandActionCell from 'views/Pools/components/PoolsTable/Cells/ExpandActionCell'
import AutoEarningsCell from 'views/Pools/components/PoolsTable/Cells/AutoEarningsCell'
import EarningsCell from '../../MigrationStep1/OldPool/Cells/EarningsCell'
import TotalStakedCell from '../../MigrationStep1/OldPool/Cells/TotalStakedCell'
import StakedCell from './Cells/StakedCell'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
}

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
  cursor: pointer;
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account }) => {
  const { isXl, isXxl, isXs, isSm, isMd, isLg, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const { totalCakeInVault } = useVaultPoolByKey(pool.vaultKey)
  const vaultPools = useVaultPools()
  const cakeInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalCakeInVault)
  }, BIG_ZERO)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell pool={pool} />
        {isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && <StakedCell pool={pool} account={account} />}
        {pool.vaultKey ? (
          isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && <AutoEarningsCell pool={pool} account={account} />
        ) : (
          <EarningsCell pool={pool} account={account} />
        )}
        {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
        {isLargerScreen && (
          <TotalStakedCell pool={pool} totalCakeInVault={totalCakeInVault} cakeInVaults={cakeInVaults} />
        )}
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      )}
    </>
  )
}

export default PoolRow
