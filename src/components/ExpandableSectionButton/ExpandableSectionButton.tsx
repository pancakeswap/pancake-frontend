import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, Text } from '@pancakeswap-libs/uikit'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick }) => {
  return (
    <Wrapper onClick={() => onClick()}>
      <Text color="primary" bold>
        Details
      </Text>
      <ChevronDownIcon />
    </Wrapper>
  )
}

export default ExpandableSectionButton
