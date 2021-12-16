import React, { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AvgBalanceCell from './Cells/AvgBalanceCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const isPoolZero = pool.sousId === 0

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell pool={pool} />
        {pool.vaultKey ? (
          ((isXLargerScreen && pool.vaultKey === VaultKey.IfoPool) || pool.vaultKey === VaultKey.CakeVault) && (
            <AutoEarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          )
        ) : (
          <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        )}
        {pool.vaultKey === VaultKey.IfoPool ? (
          <AvgBalanceCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        ) : isXLargerScreen && isPoolZero ? (
          <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        ) : null}
        {pool.vaultKey ? (
          <AutoAprCell flex={['1 0 50px', '1 0 50px', '1 0 120px', '1 0 120px', '2 0 100px']} pool={pool} />
        ) : (
          <AprCell
            flex={
              isPoolZero
                ? ['1 0 50px', '1 0 50px', '1 0 120px', '1 0 120px', '2 0 100px']
                : ['1 0 50px', '1 0 50px', '1 0 120px']
            }
            pool={pool}
          />
        )}
        {isLargerScreen && <TotalStakedCell pool={pool} />}
        {isDesktop && !isPoolZero && <EndsInCell pool={pool} />}
        <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} />
      </StyledRow>
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      )}
    </>
  )
}

export default PoolRow
