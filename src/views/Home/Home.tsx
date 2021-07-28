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
  display: grid;
  grid-template-columns: repeat( 2, minmax(210px, 1fr) );
  grid-column-gap: 50px;
  grid-row-gap: 30px;
  margin-top: 50px;
  padding: 10px 80px;
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
        </CardsContainer>
      </Page>
    </>
  )
}

export default Home
