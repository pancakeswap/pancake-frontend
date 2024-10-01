import { Button } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const PrimaryOutlineButton = styled(Button)<{ $height?: string }>`
  border-radius: ${({ theme }) => theme.radii['12px']};
  height: ${({ $height }) => $height ?? '40px'};

  color: ${({ theme, variant }) => (variant === 'text' ? theme.colors.primary60 : 'text')};
  border: ${({ theme, variant }) => (variant === 'text' ? `2px solid ${theme.colors.primary}` : '')};
`
