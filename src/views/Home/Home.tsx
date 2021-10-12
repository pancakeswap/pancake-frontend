import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, useMatchBreakpoints } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import AnnouncementCard from 'views/Home/components/AnnouncementCard'
import ZmbeStats from 'views/Home/components/ZmbeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import { useWeb3React } from '@web3-react/core'
import GraveStakingCard from './components/GraveStakingCard'
import * as fetch from '../../redux/fetch'
import store from '../../redux/store'
import { zombiePriceUsd } from '../../redux/get'
import WhatsNewCard from './components/WhatsNewCard'
import NFTBanner from './components/NFTBanner'
import Title from './components/Title'
import GraveyardCard from './components/GraveyardCard'
import EnterGravesCard from './components/EnterGravesCard'
import useEagerConnect from '../../hooks/useEagerConnect'
import { useMultiCall } from '../../hooks/useContract'

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

const Home: React.FC = () => {
  useEagerConnect()
  const {account} = useWeb3React()
  useEffect(() => {
    fetch.initialData(account)
  }, [account])

  return (
    <>
     {/* <NFTBanner/> */}
    <Title/>
    <Page>
      <div>
        <Cards>
          <GraveStakingCard />
          <AnnouncementCard />
        </Cards>
        <Cards>
          <EnterGravesCard/>
          <TotalValueLockedCard/>
          <ZmbeStats />
          <WhatsNewCard/>
        </Cards>
      </div>
    </Page>
    </>
  )
}

export default Home