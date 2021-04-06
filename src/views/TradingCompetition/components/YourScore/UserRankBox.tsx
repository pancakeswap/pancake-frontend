import React from 'react'
import styled from 'styled-components'
import { Flex, Text, FlexProps } from '@pancakeswap-libs/uikit'

interface UserRankProps extends FlexProps {
  title?: string
  footer?: string
}

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px 18px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 8px 24px;
  }
`

const UserRank: React.FC<UserRankProps> = ({ title = '', footer, children, ...props }) => {
  return (
    <Wrapper {...props}>
      <Text mb="8px" fontSize="12px" bold>
        {title}
      </Text>
      {children}
      <Text mt="8px" fontSize="12px" color="textSubtle" textAlign="center">
        {footer}
      </Text>
    </Wrapper>
  )
}

export default UserRank
