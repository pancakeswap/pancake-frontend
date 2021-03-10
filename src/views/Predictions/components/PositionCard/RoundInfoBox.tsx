import styled, { DefaultTheme } from 'styled-components'
import { Box } from '@pancakeswap-libs/uikit'
import { Position } from 'state/types'

interface RoundInfoBoxProps {
  roundPosition?: Position
  isActive?: boolean
}

interface ThemedRoundInfoBoxProps extends RoundInfoBoxProps {
  theme: DefaultTheme
}

const getBorderColor = ({ theme, roundPosition, isActive = false }: ThemedRoundInfoBoxProps) => {
  if (roundPosition === Position.UP) {
    return theme.colors.success
  }

  if (roundPosition === Position.DOWN) {
    return theme.colors.failure
  }

  if (isActive) {
    return theme.colors.secondary
  }

  return theme.colors.borderColor
}

const RoundInfoBox = styled(Box)<RoundInfoBoxProps>`
  border: 2px solid ${getBorderColor};
  border-radius: 8px;
  padding: 16px;
`

export default RoundInfoBox
