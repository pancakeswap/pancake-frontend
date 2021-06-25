import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPRCard from 'views/Home/components/EarnAPRCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/active-autodex.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 220px 110px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/active.png'), url('/images/autodex.png');
    background-position: left center, right center;
    background-size: 165px;
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
    grid-column: span 12; {/* default 6 */}
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12; {/* default 8 */}
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;
    & > div {
      grid-column: span 12; {/* default 6 */}
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 24px;
  grid-gap: 24px;
  & > div {
    grid-column: span 12; {/* default 6 */}
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12; {/* default 8 */}
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 32px;
    grid-gap: 32px;
    & > div {
      grid-column: span 12; {/* default 4 */}
    }
  }
`

const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Hero>
        <Heading as="h1" scale="xl" mb="24px" color="#f3931a">
          {t('Autodex')}
        </Heading>
        <Text>{t('Swap your assets with Autodex! - Automatic | Fast | Reliable')}</Text>
      </Hero>
      <div>
        <Cards>
          <FarmStakingCard />
          {/* <LotteryCard /> */}
        </Cards>
        {/* <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards> */}
      </div>
    </Page>
  )
}

export default Home
