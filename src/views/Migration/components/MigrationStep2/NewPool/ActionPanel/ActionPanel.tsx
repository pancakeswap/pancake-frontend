import React from 'react'
import { Text } from '@pancakeswap/uikit'
import styled, { keyframes, css } from 'styled-components'
import { DeserializedPool } from 'state/types'
import TotalStaked from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/TotalStaked'
import AutoEarning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/AutoEarning'
import Earning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/Earning'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { PerformanceFee } from 'views/Pools/components/Stat'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
// import AprRow from './AprRow'
import Staked from './Staked'

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
  ${Text} {
    font-size: 16px;
  }
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
  border-radius: 0 0 16px 16px;

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

const PerformanceContainter = styled.div`
  margin-top: 12px;
  padding: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 0px;
    padding: 0 12px;
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
    fees: { performanceFeeAsDecimal },
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
      {/* <AprRow pool={pool} /> */}
      {pool.vaultKey && (
        <PerformanceContainter>
          <PerformanceFee>
            <Text ml="4px" small>
              0~{performanceFeeAsDecimal}%
            </Text>
          </PerformanceFee>
        </PerformanceContainter>
      )}
      <TotalStaked pool={pool} totalCakeInVault={totalCakeInVault} cakeInVaults={cakeInVaults} />
    </StyledActionPanel>
  )
}

export default ActionPanel
