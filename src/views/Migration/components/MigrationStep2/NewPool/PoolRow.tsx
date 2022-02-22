import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import NameCell from 'views/Pools/components/PoolsTable/Cells/NameCell'
import AprCell from 'views/Pools/components/PoolsTable/Cells/AprCell'
import AutoAprCell from 'views/Pools/components/PoolsTable/Cells/AutoAprCell'
import StakedCell from '../../MigrationStep1/OldPool/Cells/StakedCell'
import AutoEarningsCell from '../../MigrationStep1/OldPool/Cells/AutoEarningsCell'
import EarningsCell from '../../MigrationStep1/OldPool/Cells/EarningsCell'
import TotalStakedCell from '../../MigrationStep1/OldPool/Cells/TotalStakedCell'
import ExpandActionCell from '../../MigrationStep1/OldPool/Cells/ExpandActionCell'
import StakeButton from './Cells/StakeButton'
import ActionPanel from './ActionPanel/ActionPanel'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
}

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.md} {
    cursor: initial;
  }
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

const AprContainer = styled.div`
  display: none;
  flex: 2 0 100px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account }) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    if (!isLargerScreen) {
      setExpanded((prev) => !prev)
    }
  }

  const EarningComponent = () => {
    if (isLargerScreen || !expanded) {
      return pool.vaultKey === VaultKey.IfoPool || pool.vaultKey === VaultKey.CakeVault ? (
        <AutoEarningsCell pool={pool} account={account} />
      ) : (
        <EarningsCell pool={pool} account={account} />
      )
    }
    return null
  }

  const AprComponent = () => {
    if (isLargerScreen || !expanded) {
      return pool.vaultKey ? (
        <AprContainer>
          <AutoAprCell pool={pool} />
        </AprContainer>
      ) : (
        <AprContainer>
          <AprCell pool={pool} />
        </AprContainer>
      )
    }
    return null
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <LeftContainer>
          <NameCell pool={pool} />
          {isLargerScreen || !expanded ? <StakedCell pool={pool} account={account} /> : null}
          {EarningComponent()}
          {AprComponent()}
          {isLargerScreen && <TotalStakedCell pool={pool} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || !expanded ? <StakeButton pool={pool} /> : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
      {!isLargerScreen && shouldRenderActionPanel && <ActionPanel pool={pool} expanded={expanded} />}
    </>
  )
}

export default PoolRow
