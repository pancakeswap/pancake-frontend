import { Box } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 16px;
  padding: 1rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

export const LightGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
`

export const DarkGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.background};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.backgroundDisabled};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.colors.gradientGold};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`

export const BlueCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.gradientBlue};
  border-radius: 12px;
  width: fit-content;
`

export const ScrollableX = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const GreyBadge = styled(Card)`
  width: fit-content;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundDisabled};
  color: ${({ theme }) => theme.colors.text};
  padding: 4px 6px;
  font-weight: 400;
`
