import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { DeserializedPool } from 'state/types'
import TotalStaked from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/TotalStaked'
import AutoEarning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/AutoEarning'
import Earning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/Earning'
import AprRow from './AprRow'
import Staked from './Staked'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 700px;
  }
  to {
    opacity: 0;
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  opacity: 1;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 12px 10px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    margin-bottom: 24px;
  }
`

interface ActionPanelProps {
  pool: DeserializedPool
  account: string
  expanded: boolean
}

const ActionPanel: React.FC<ActionPanelProps> = ({ pool, account, expanded }) => {
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
  const { autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    pool.earningTokenPrice,
  )

  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        {pool.vaultKey ? (
          <AutoEarning
            earningTokenBalance={autoCakeToDisplay}
            earningTokenDollarBalance={autoUsdToDisplay}
            earningTokenPrice={pool.earningTokenPrice}
          />
        ) : (
          <Earning {...pool} />
        )}
        <Staked pool={pool} />
      </ActionContainer>
      <AprRow pool={pool} />
      <TotalStaked pool={pool} totalCakeInVault={totalCakeInVault} cakeInVaults={cakeInVaults} />
    </StyledActionPanel>
  )
}

export default ActionPanel
