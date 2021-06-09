import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@zoeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'
import { Timeline } from 'react-twitter-widgets'
import useTheme from 'hooks/useTheme'


const Hero = styled.div`
  align-items: center;
  background-image: url('/images/cool-background.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;
  border-radius:25px;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/cool-background.svg');
    background-position: right center;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 24px;
  grid-gap: 24px;

  & > div {
    grid-column: span 6;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;

    & > div {
      grid-column: span 4;
    }
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  const { isDark, toggleTheme } = useTheme()


  return (
    <Page>
      <Hero>
        <Heading as="h1" scale="xl" mb="24px" color="white">
          ZOE Swap
        </Heading>
        <Text color={isDark?'#372f47':"white"}>{t('The #1 AMM and yield farm on Binance Smart Chain.')}</Text>
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          {/* <LotteryCard /> */}
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'Zoecashoficial'
            }}
            options={{
              height: '400',
              theme:isDark? 'dark':''
            }}
            
          />
        </Cards>
        <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
  )
}

export default Home
