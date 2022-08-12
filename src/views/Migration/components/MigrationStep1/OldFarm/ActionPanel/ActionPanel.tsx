import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import Staked from './Staked'
import Earned from './Earned'
import Multiplier from './Multiplier'
import Liquidity from './Liquidity'
import { EarnedProps } from '../Cells/Earned'
import { FarmProps } from '../Cells/Farm'
import { MultiplierProps } from '../Cells/Multiplier'
import { LiquidityProps } from '../Cells/Liquidity'

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
  earned: EarnedProps
  farm: FarmProps
  expanded: boolean
  multiplier: MultiplierProps
  liquidity: LiquidityProps
}

const ActionPanel: React.FC<React.PropsWithChildren<ActionPanelProps>> = ({
  expanded,
  earned,
  farm,
  multiplier,
  liquidity,
}) => {
  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        <Earned {...earned} />
        <Staked {...farm} />
      </ActionContainer>
      <Multiplier {...multiplier} />
      <Liquidity {...liquidity} />
    </StyledActionPanel>
  )
}

export default ActionPanel
