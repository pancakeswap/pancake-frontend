import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import NameCell from 'views/Pools/components/PoolsTable/Cells/NameCell'
import AprCell from 'views/Pools/components/PoolsTable/Cells/AprCell'
import AutoAprCell from 'views/Pools/components/PoolsTable/Cells/AutoAprCell'
import AutoEarningsCell from '../../MigrationStep1/OldPool/Cells/AutoEarningsCell'
import EarningsCell from '../../MigrationStep1/OldPool/Cells/EarningsCell'
import TotalStakedCell from '../../MigrationStep1/OldPool/Cells/TotalStakedCell'
import ExpandActionCell from '../../MigrationStep1/OldPool/Cells/ExpandActionCell'
import StakedCell from './Cells/StakedCell'
import StakeButton from './StakeButton'
import StakeButtonCells from './Cells/StakeButtonCells'
import ActionPanel from './ActionPanel/ActionPanel'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getCakeVaultEarnings } from 'views/Pools/helpers'

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

  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
    totalCakeInVault,
  } = useVaultPoolByKey(pool.vaultKey)
  const vaultPools = useVaultPools()
  const cakeInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalCakeInVault)
  }, BIG_ZERO)

  // Auto Earning
  const { autoCakeToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    pool.earningTokenPrice,
  )
  const hasEarnings = account && cakeAtLastUserAction && cakeAtLastUserAction.gt(0) && userShares && userShares.gt(0)

  const toggleExpanded = () => {
    if (!isLargerScreen) {
      setExpanded((prev) => !prev)
    }
  }

  const EarningComponent = () => {
    if (isLargerScreen || !expanded) {
      return pool.vaultKey === VaultKey.IfoPool || pool.vaultKey === VaultKey.CakeVault ? (
        <AutoEarningsCell hasEarnings={hasEarnings} earningTokenBalance={autoCakeToDisplay} />
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
          {isLargerScreen && (
            <TotalStakedCell pool={pool} totalCakeInVault={totalCakeInVault} cakeInVaults={cakeInVaults} />
          )}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || !expanded ? (
            <StakeButtonCells>
              <StakeButton pool={pool} />
            </StakeButtonCells>
          ) : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
      {!isLargerScreen && shouldRenderActionPanel && <ActionPanel pool={pool} account={account} expanded={expanded} />}
    </>
  )
}

export default PoolRow
