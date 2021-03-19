import React from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap-libs/uikit'
import Header from './Header'

interface HistoryPaneProps {
  isActive: boolean
}

const StyledHistoryPane = styled.div<HistoryPaneProps>`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: -4px 0px 4px -8px rgba(14, 14, 44, 0.1);
  filter: drop-shadow(-1px 0px 1px rgba(0, 0, 0, 0.1));
  height: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  transition: 300ms ease-in-out;
  width: ${({ isActive }) => (isActive ? '320px' : 0)};
  z-index: 50;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ isActive }) => (isActive ? '384px' : 0)};
  }
`

const HistoryPane: React.FC<HistoryPaneProps> = ({ isActive }) => {
  return (
    <StyledHistoryPane isActive={isActive}>
      <Box overflow="hidden">
        <Header />
      </Box>
    </StyledHistoryPane>
  )
}

export default HistoryPane
