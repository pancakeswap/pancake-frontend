import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import CakeStats from './components/CakeStats'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  margin: 32px auto;
  max-width: 904px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg2.svg'), url('/images/pan-bg.svg');
    background-position: left center, right center;
    height: 165px;
    margin-top: 48px;
    padding-top: 0;
  }
`

const Title = styled(Heading)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 40px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Subtitle = styled(Text)`
  font-weight: 400;
`

const Cards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero>
        <div>
          <Title as="h1">{TranslateString(999, 'Pancake Swap')}</Title>
          <Subtitle>
            {TranslateString(
              999,
              'The #1 AMM and yield farm on Binance Smart Chain.',
            )}
          </Subtitle>
        </div>
      </Hero>
      <Container>
        <Cards>
          <FarmStakingCard />
          <LotteryCard />
        </Cards>
        <CakeStats />
      </Container>
    </Page>
  )
}

export default Home
