import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Box, Flex, Grid, Image } from '@pancakeswap/uikit'

export const TwoColumnsContainer = styled(Flex)`
  gap: 22px;
  align-items: flex-start;
  & > div:first-child {
    flex: 1;
    gap: 20px;
  }
  & > div:last-child {
    flex: 2;
  }
`

export const RoundedImage = styled(Image)`
  height: max-content;
  border-radius: ${({ theme }) => theme.radii.default};
  overflow: hidden;
  & > img {
    object-fit: contain;
  }
`

export const SmallRoundedImage = styled(Image)`
  & > img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

export const Container = styled(Flex)`
  gap: 24px;
`

export const CollectionLink = styled(NextLinkFromReactRouter)`
  color: ${({ theme }) => theme.colors.primary};
  display: block;
  font-weight: 600;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 50px;
  }
`

export const CollectibleRowContainer = styled(Grid)`
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`

export const StyledSortButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`

export const ButtonContainer = styled(Box)`
  text-align: right;
  padding-right: 24px;
`

export const TableHeading = styled(Grid)`
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`
