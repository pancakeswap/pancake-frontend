import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import NameCell from 'views/Pools/components/PoolsTable/Cells/NameCell'
import StakedCell from './Cells/StakedCell'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import EarningsCell from './Cells/EarningsCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import Unstaked from './Cells/Unstaked'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl

  const isCakePool = pool.sousId === 0

  return (
    <>
      <StyledRow role="row">
        <NameCell pool={pool} />
        <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        {pool.vaultKey ? (
          ((isXLargerScreen && pool.vaultKey === VaultKey.IfoPool) || pool.vaultKey === VaultKey.CakeVault) && (
            <AutoEarningsCell pool={pool} account={account} />
          )
        ) : (
          <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
        )}
        {isLargerScreen && isCakePool && <TotalStakedCell pool={pool} />}
        <Unstaked pool={pool} />
      </StyledRow>
    </>
  )
}

export default PoolRow
