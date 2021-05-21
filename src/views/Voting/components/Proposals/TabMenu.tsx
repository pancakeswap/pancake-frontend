import React from 'react'
import styled from 'styled-components'
import { TabMenu as UIKitTabMenu, Tab } from '@pancakeswap/uikit'
import { ProposalType } from '../../types'

interface TabMenuProps {
  proposalType: ProposalType
  onTypeChange: (proposalType: ProposalType) => void
}

const StyledTabMenu = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  padding-top: 16px;
`

const getIndexFromType = (proposalType: ProposalType) => {
  switch (proposalType) {
    case ProposalType.COMMUNITY:
      return 1
    case ProposalType.ALL:
      return 2
    case ProposalType.CORE:
    default:
      return 0
  }
}

const getTypeFromIndex = (index: number) => {
  switch (index) {
    case 1:
      return ProposalType.COMMUNITY
    case 2:
      return ProposalType.ALL
    default:
      return ProposalType.CORE
  }
}

const TabMenu: React.FC<TabMenuProps> = ({ proposalType, onTypeChange }) => {
  const handleItemClick = (index: number) => {
    onTypeChange(getTypeFromIndex(index))
  }

  return (
    <StyledTabMenu>
      <UIKitTabMenu activeIndex={getIndexFromType(proposalType)} onItemClick={handleItemClick}>
        <Tab>Core</Tab>
        <Tab>Community</Tab>
        <Tab>All</Tab>
      </UIKitTabMenu>
    </StyledTabMenu>
  )
}

export default TabMenu
