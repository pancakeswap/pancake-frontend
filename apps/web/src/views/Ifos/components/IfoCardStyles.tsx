import { Card, StyledLink } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import NextLink from 'next/link'
import { TypographyProps, typography } from 'styled-system'

export const StyledCard = styled(Card)`
  background: none;
  max-width: 368px;
  width: 100%;
  margin: 0 auto;
  height: fit-content;
`

export const CardsWrapper = styled.div<{ $singleCard?: boolean; $shouldReverse?: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: ${({ $singleCard }) => ($singleCard ? '1fr' : '1fr 1fr')};
    justify-items: ${({ $singleCard }) => ($singleCard ? 'center' : 'unset')};
  }

  > div:nth-child(1) {
    order: ${({ $shouldReverse }) => ($shouldReverse ? 2 : 1)};
  }

  > div:nth-child(2) {
    order: ${({ $shouldReverse }) => ($shouldReverse ? 1 : 2)};
  }
`

export const MessageTextLink = styled(StyledLink)`
  display: inline;
  text-decoration: underline;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
`

export const TextLink = styled(NextLink)<TypographyProps>`
  display: inline;
  text-decoration: underline;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  ${typography}
`
