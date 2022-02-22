import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { DeserializedPool } from 'state/types'
import TotalStaked from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/TotalStaked'
import AutoEarning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/AutoEarning'
import Earning from 'views/Migration/components/MigrationStep1/OldPool/ActionPanel/Earning'
// import Staked from './Stake'

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
  expanded: boolean
}

const ActionPanel: React.FC<ActionPanelProps> = ({ pool, expanded }) => {
  return (
    <StyledActionPanel expanded={expanded}>
      <ActionContainer>
        {pool.vaultKey ? <AutoEarning {...pool} /> : <Earning {...pool} />}
        {/* <Staked pool={pool} /> */}
      </ActionContainer>
      <TotalStaked pool={pool} />
    </StyledActionPanel>
  )
}

export default ActionPanel
