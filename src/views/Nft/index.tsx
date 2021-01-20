import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import HowItWorks from './components/HowItWorks'
import NftList from './components/NftList'
import NftProvider from './contexts/NftProvider'
import NftInfo from './components/NftInfo'

const StyledHero = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
`

const Nft = () => {
  const TranslateString = useI18n()

  return (
    <NftProvider>
      <Page>
        <StyledHero>
          <Heading as="h1" size="xxl" color="secondary" mb="24px">
            NFTs
          </Heading>
          <Heading as="h2" size="lg" color="secondary">
            {TranslateString(999, 'Trade in for CAKE, or keep for your collection!')}
          </Heading>
        </StyledHero>
        <NftInfo />
        <NftList />
        <HowItWorks />
      </Page>
    </NftProvider>
  )
}

export default Nft
