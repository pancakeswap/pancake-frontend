import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import NameCell from 'views/Pools/components/PoolsTable/Cells/NameCell'
import StakedCell from './Cells/StakedCell'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import EarningsCell from './Cells/EarningsCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import Unstaked from './Cells/Unstaked'
import ExpandActionCell from './Cells/ExpandActionCell'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    align-self: center;
    flex-direction: row;
  }
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
  }
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isMobile, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    if (!isLargerScreen) {
      setExpanded((prev) => !prev)
    }
  }

  const isCakePool = pool.sousId === 0

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <LeftContainer>
          <NameCell pool={pool} />
          {isLargerScreen ? (
            <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          ) : (
            !expanded && <StakedCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          )}
          {pool.vaultKey ? (
            (pool.vaultKey === VaultKey.IfoPool || pool.vaultKey === VaultKey.CakeVault) && (
              <AutoEarningsCell pool={pool} account={account} />
            )
          ) : (
            <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          )}
          {isLargerScreen && isCakePool && <TotalStakedCell pool={pool} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen ? <Unstaked pool={pool} /> : !expanded && <Unstaked pool={pool} />}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
    </>
  )
}

export default PoolRow
