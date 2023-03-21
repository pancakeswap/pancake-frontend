import styled from 'styled-components'
import { Box, BoxProps } from '@pancakeswap/uikit'

export interface LightCardProps extends BoxProps {
  width?: string
  padding?: string | string[]
  border?: string
  borderRadius?: string
}

const Card = styled(Box)<LightCardProps>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius ?? '16px'};
  background-color: ${({ theme }) => theme.colors.background};
`

export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

export const LightGreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`

export const LightTertiaryCard = styled(Card)<{ active: boolean }>`
  border: 1px solid ${({ theme, active }) => (active ? 'none' : theme.colors.cardBorder)};
  background-color: ${({ theme }) => theme.colors.tertiary};
`

export const DisableCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.disabled};
`
