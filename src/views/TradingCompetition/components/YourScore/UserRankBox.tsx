import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Skeleton, FlexProps } from '@pancakeswap-libs/uikit'

interface UserRankProps extends FlexProps {
  title?: string
  footer?: string
  isLoading?: boolean
}

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 8px 24px;
`

const UserRank: React.FC<UserRankProps> = ({ title = '', footer, isLoading, children, ...props }) => {
  return (
    <Wrapper {...props}>
      <Text mb="8px" fontSize="12px" fontWeight={600}>
        {isLoading ? <Skeleton width="50px" height="18px" /> : title.toUpperCase()}
      </Text>
      {children}
      <Text mt="8px" fontSize="12px" color="textSubtle" textAlign="center">
        {isLoading ? <Skeleton width="50px" height="18px" /> : footer}
      </Text>
    </Wrapper>
  )
}

export default UserRank
