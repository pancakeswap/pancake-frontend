import { Flex, Text } from '@pancakeswap/uikit'
import React, { ReactElement } from 'react'
import { DefaultTheme, styled } from 'styled-components'

type Status = 'expired' | 'live' | 'next' | 'soon' | 'canceled' | 'calculating'

interface AICardHeaderProps {
  status: Status
  title: string
  epoch: number
  icon?: ReactElement
}

const HEADER_HEIGHT = '28px'

// Used to get the gradient for the card border, which depends on the header color to create the illusion
// that header is overlapping the 1px card border.
// 'live' is not included into the switch case because it has isActive border style
export const getBorderBackground = (theme: DefaultTheme, status: Status) => {
  const gradientStopPoint = `calc(${HEADER_HEIGHT} + 1px)`
  switch (status) {
    case 'calculating':
      return `linear-gradient(transparent ${gradientStopPoint}, ${theme.colors.cardBorder} ${gradientStopPoint}), ${theme.colors.gradientCardHeader}`
    case 'canceled':
      return `linear-gradient(${theme.colors.warning} ${gradientStopPoint}, ${theme.colors.cardBorder} ${gradientStopPoint})`
    case 'next':
      return `linear-gradient(${theme.colors.secondary} ${gradientStopPoint}, ${theme.colors.cardBorder} ${gradientStopPoint})`
    case 'expired':
    case 'soon':
    default:
      return theme.colors.cardBorder
  }
}

const getBackgroundColor = (theme: DefaultTheme, status: Status) => {
  switch (status) {
    case 'calculating':
      return theme.colors.gradientCardHeader
    case 'live':
      return 'transparent'
    case 'canceled':
      return theme.colors.warning
    case 'next':
      return theme.colors.secondary
    case 'expired':
    case 'soon':
    default:
      return theme.colors.cardBorder
  }
}

type TextColor = 'textDisabled' | 'white' | 'secondary' | 'text' | 'textSubtle'
type FallbackColor = 'text' | 'textSubtle'

const getTextColorByStatus = (status: Status, fallback: FallbackColor): TextColor => {
  switch (status) {
    case 'expired':
      return 'textDisabled'
    case 'next':
      return 'white'
    case 'live':
      return 'secondary'
    case 'canceled':
    case 'calculating':
      return 'text'
    default:
      return fallback
  }
}

const StyledCardHeader = styled.div<{ status: Status }>`
  height: ${HEADER_HEIGHT};
  background: ${({ theme, status }) => getBackgroundColor(theme, status)};
  align-items: ${({ status }) => (status === 'next' ? 'start' : 'center')};
  display: flex;
  justify-content: space-between;
  padding: ${({ status }) => (status === 'live' ? '16px' : '12px')};
`

const Round = styled.div`
  justify-self: center;
`

export const AICardHeader: React.FC<React.PropsWithChildren<AICardHeaderProps>> = ({ status, title, epoch, icon }) => {
  const textColor = getTextColorByStatus(status, 'text')
  const isLive = status === 'live'

  return (
    <StyledCardHeader status={status}>
      <Flex alignItems="center">
        {icon}
        <Text color={textColor} bold={isLive} textTransform={isLive ? 'uppercase' : 'capitalize'} lineHeight="21px">
          {title}
        </Text>
      </Flex>
      <Round>
        <Text fontSize={isLive ? '14px' : '12px'} color={getTextColorByStatus(status, 'textSubtle')} textAlign="center">
          {`#${epoch}`}
        </Text>
      </Round>
    </StyledCardHeader>
  )
}
