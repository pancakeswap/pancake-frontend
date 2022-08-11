import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import Multiplier from 'views/Migration/components/MigrationStep1/OldFarm/ActionPanel/Multiplier'
import Liquidity from 'views/Migration/components/MigrationStep1/OldFarm/ActionPanel/Liquidity'
import { EarnedProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Earned'
import { FarmProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Farm'
import { AprProps } from 'views/Farms/components/FarmTable/Apr'
import { MultiplierProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Multiplier'
import { LiquidityProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Liquidity'
import Staked from './Staked'
import AprRow from './AprRow'

const expandAnimation = keyframes`
  from {
    opacity: 0;
    max-height: 0px;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    opacity: 1;
    max-height: 1000px;
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
  expanded: boolean
  earned: EarnedProps
  farm: FarmProps
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
}

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({
  expanded,
  earned,
  farm,
  apr,
  multiplier,
  liquidity,
}) => {
  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        <Staked earned={earned} farm={farm} />
      </ActionContainer>
      <AprRow {...apr} />
      <Multiplier {...multiplier} />
      <Liquidity {...liquidity} />
    </StyledActionPanel>
  )
}

export default ActionPanel
