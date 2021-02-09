import { Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface CardProps {
  image: string
  title: ReactNode
  description?: ReactNode
}

const Avatar = styled.img`
  border-radius: 50%;
  height: 48px;
  margin-right: 16px;
  width: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 64px;
    width: 64px;
  }
`

const Card: React.FC<CardProps> = ({ image, title, description }) => {
  return (
    <Flex alignItems="center">
      <Avatar src={image} alt="achievement card" />
      <div>
        <Heading size="md">{title}</Heading>
        {description && (
          <Text as="p" mt="8px" color="textSubtle">
            {description}
          </Text>
        )}
      </div>
    </Flex>
  )
}

export default Card
