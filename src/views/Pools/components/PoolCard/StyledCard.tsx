import styled, { css, keyframes } from 'styled-components'
import { Card, Box } from '@pancakeswap/uikit'

const PromotedGradient = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

interface PromotedStyleCardProps {
  isDesktop: boolean
}

export const StyledCard = styled(Card)<{ isPromoted?: PromotedStyleCardProps; isFinished?: boolean }>`
  max-width: 352px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  box-shadow: 0px 1px 4px rgba(25, 19, 38, 0.15);

  ${({ isPromoted, theme }) =>
    isPromoted
      ? css`
          background: linear-gradient(180deg, ${theme.colors.primaryBright}, ${theme.colors.secondary});
          padding: 1px 1px 3px 1px;
          background-size: 400% 400%;
        `
      : `background: ${(props) => props.theme.card.background};`}

  ${({ isPromoted }) => isPromoted && isPromoted.isDesktop && `animation: ${PromotedGradient} 3s ease infinite;`}

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export const StyledCardInner = styled(Box)<{ isPromotedPool?: boolean }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ isPromotedPool, theme }) => (isPromotedPool ? '31px' : theme.radii.card)};
`

export default StyledCard
