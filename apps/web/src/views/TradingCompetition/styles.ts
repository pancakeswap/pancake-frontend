import { styled } from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'

export const CompetitionPage = styled.div`
  min-height: calc(100vh - 64px);
`

export const BannerFlex = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding-top: 10px;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  @media screen and (min-width: 1920px) {
    padding-top: 32px;
  }
`

export const BottomBunnyWrapper = styled(Box)`
  position: relative;
  z-index: 3;
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    position: relative;
    right: -66px;
    margin-left: -20px;
    width: 182px;
    height: 214px;
  }
`
