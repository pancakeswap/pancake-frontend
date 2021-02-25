import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from 'toastswapuikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPYCard from 'views/Home/components/EarnAPYCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  align-items: left;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: left;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: left;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    height: 165px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

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
    & > div {
      grid-column: span 6;
    }
  }
`

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

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
      grid-column: span 4;
    }
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <div>
        <Cards>
          <FarmStakingCard />
          <CakeStats />
        </Cards>
      </div>

      <Heading as="h1" size="lg" mb="24px" color="white">
        {TranslateString(576, 'Announcements')}
      </Heading>

      <div className="newsitem">
        <div className="pt-6 flex mx-4">
          <div className="pr-4">
            <h4 className="text-sm font-semibold">UPCOMING: LOAFS</h4>
          </div>
        </div>
        <div className="pt-2 pb-6 flex mx-4 border-b border-gray-100">
          <div className="pr-4 2xl:w-full">
            <div className="mt-1">
              <p>
                We are cooking up a new way to hold an index of tokens. Create portfolios of tokens that are tradeable
                on exchanges using a LoafSet. A Loaf is a token that represents a fully collateralized portfolio of
                other assets including Bitcoin (WBTC), Ethereum (WETH), and dollar-pegged coins (DAI). Loafs
                automatically rebalance to make executing any portfolio strategy simple.
              </p>
            </div>
          </div>
          <div className="ml-4 flex items-start">
            <div className="rounded bg-gray-300 mt-2 sm:mt-0 w-20 sm:w-32 h-20">
              <img alt="basicimg" src="../images/kitchen.jpg" />
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Home
