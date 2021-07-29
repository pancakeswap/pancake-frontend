import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import FarmsStackingCards from './components/cards/FarmsStackingCards'
import TwitterFeed from './components/cards/TwitterFeed'
import HighestAPR from './components/cards/HighestAPR'
import AcrossPoolsFarms from './components/cards/AcrossPoolsFarms'

const CardsContainer = styled.div`{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  > div {
    max-width: 430px;
    width: 100%;
    margin: 15px 30px;
  }
}`
const Home: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Page>
        <Heading as="h1" scale="xl" mb="24px" color="#000000" textAlign='center'>
            {t('HOME')}
        </Heading>
        <CardsContainer>
          <FarmsStackingCards />
          <TwitterFeed />
          <HighestAPR />
          <AcrossPoolsFarms />
        </CardsContainer>
      </Page>
    </>
  )
}

export default Home
