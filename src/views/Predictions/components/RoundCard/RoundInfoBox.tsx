import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { Box } from '@pancakeswap-libs/uikit'
import { BetPosition } from 'state/types'

interface RoundInfoBoxProps {
  betPosition?: BetPosition
  isNext?: boolean
  isLive?: boolean
  hasEntered?: boolean
}

const getBackgroundColor = ({
  theme,
  betPosition,
  isNext,
  isLive,
  hasEntered,
}: RoundInfoBoxProps & { theme: DefaultTheme }) => {
  if (isNext) {
    return 'linear-gradient(180deg, #53DEE9 0%, #7645D9 100%)'
  }

  if (hasEntered || isLive) {
    return theme.colors.secondary
  }

  if (betPosition === BetPosition.BULL) {
    return theme.colors.success
  }

  if (betPosition === BetPosition.BEAR) {
    return theme.colors.failure
  }

  return theme.colors.borderColor
}

const Background = styled(Box)<RoundInfoBoxProps>`
  background: ${getBackgroundColor};
  border-radius: 8px;
  padding: 2px;
`

const StyledRoundInfoBox = styled.div`
  background: ${({ theme }) => theme.card.background};
  border-radius: 6px;
  padding: 16px;
`

const RoundInfoBox: React.FC<RoundInfoBoxProps> = ({
  isNext = false,
  hasEntered = false,
  isLive = false,
  children,
  ...props
}) => {
  return (
    <Background isNext={isNext} hasEntered={hasEntered} isLive={isLive} {...props}>
      <StyledRoundInfoBox>{children}</StyledRoundInfoBox>
    </Background>
  )
}

export default RoundInfoBox
