import React, { ReactElement } from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'

type Status = 'expired' | 'live' | 'next' | 'soon'

interface CardHeaderProps {
  status: Status
  title: string
  epoch: number
  blockNumber: number
  icon?: ReactElement
}

const getBackgroundColor = (status: Status) => {
  switch (status) {
    case 'live':
      return 'transparent'
    case 'next':
      return 'secondary'
    case 'expired':
    case 'soon':
    default:
      return 'borderColor'
  }
}

const getTextColorByStatus = (status: Status, fallback = 'text') => {
  switch (status) {
    case 'expired':
      return 'textDisabled'
    case 'next':
      return 'white'
    case 'live':
      return 'secondary'
    default:
      return fallback
  }
}

const StyledCardHeader = styled.div<{ status: Status }>`
  align-item: center;
  background-color: ${({ theme, status }) => theme.colors[getBackgroundColor(status)]};
  border-radius: 16px 16px 0 0;
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  padding: ${({ status }) => (status === 'live' ? '16px' : '8px')};
`

const CardHeader: React.FC<CardHeaderProps> = ({ status, title, epoch, blockNumber, icon }) => {
  const textColor = getTextColorByStatus(status)
  const isLive = status === 'live'

  return (
    <StyledCardHeader status={status}>
      <Flex alignItems="center">
        {icon}
        <Text color={textColor} bold={isLive} textTransform={isLive ? 'uppercase' : 'capitalize'} lineHeight="21px">
          {title}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Text fontSize={isLive ? '14px' : '12px'} color={getTextColorByStatus(status, 'textSubtle')} textAlign="center">
          {`#${epoch}`}
        </Text>
      </Flex>
      <Text color={textColor} textAlign="right">
        {blockNumber}
      </Text>
    </StyledCardHeader>
  )
}

export default CardHeader
