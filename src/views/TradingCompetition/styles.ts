import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import PageSection from 'components/PageSection'

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

export const BattleBannerSection = styled(PageSection)`
  margin-top: -82px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: -94px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -114px;
  }

  @media screen and (min-width: 1920px) {
    margin-top: -144px;
  }
`

export const BottomBunnyWrapper = styled(Box)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    margin-left: 40px;
    width: 254px;
    height: 227px;
  }
`
