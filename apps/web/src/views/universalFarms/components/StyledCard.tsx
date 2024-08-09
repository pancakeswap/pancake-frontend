import styled from 'styled-components'
import NextLink from 'next/link'
import {
  Card as RawCard,
  CardBody as RawCardBody,
  CardHeader as RawCardHeader,
  CardFooter as RawCardFooter,
} from '@pancakeswap/uikit'

export const Card = styled(RawCard)`
  overflow: initial;
`

export const CardHeader = styled(RawCardHeader)`
  background: ${({ theme }) => theme.card.background};
`

export const CardBody = styled(RawCardBody)`
  padding: 0;
`

export const CardFooter = styled(RawCardFooter)`
  position: sticky;
  bottom: 50px;
  z-index: 50;
  border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  border-bottom-left-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.card.background};
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  line-height: 18px;
  padding: 12px 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: 0;
  }
`

export const StyledNextLink = styled(NextLink)`
  &:hover {
    > div {
      background: ${({ theme }) => theme.colors.backgroundHover};
    }
  }
  &:active {
    > div {
      background: ${({ theme }) => theme.colors.backgroundTapped};
    }
  }
`
