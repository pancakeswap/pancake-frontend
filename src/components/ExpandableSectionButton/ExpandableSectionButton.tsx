import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Text } from '@pancakeswap-libs/uikit'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded }) => {
  return (
    <Wrapper aria-label="Hide or show expandable content" role="button" onClick={() => onClick()}>
      <Text color="primary" bold>
        {expanded ? 'Hide' : 'Details'}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

ExpandableSectionButton.defaultProps = {
  expanded: false,
}

export default ExpandableSectionButton
