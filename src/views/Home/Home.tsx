import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'

const Hero = styled(Container)`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg.svg'), url('/images/pan-bg2.svg');
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
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 64px;
  }
`

const Subtitle = styled(Text)`
  font-weight: 400;
`

const Cards = styled(BaseLayout)`
  align-items: start;

  & > div {
    grid-column: span 6;
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
      </Container>
    </Page>
  )
}

export default Home
