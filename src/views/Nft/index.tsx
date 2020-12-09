import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import HowItWorks from './components/HowItWorks'
import NftList from './components/NftList'
import NftProgress from './components/NftProgress'
import StatusCard from './components/StatusCard'
import NftProvider from './contexts/NftProvider'

const StyledHero = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 32px;
  padding-top: 32px;
`

const StyledNtfInfo = styled.div`
  align-items: start;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Nft = () => {
  const TranslateString = useI18n()

  return (
    <NftProvider>
      <Page>
        <Container>
          <StyledHero>
            <Heading as="h1" size="xxl" color="secondary" mb="24px">
              {TranslateString(999, 'NFTs')}
            </Heading>
            <Heading as="h2" size="lg" color="secondary">
              {TranslateString(999, 'Trade in for CAKE, or keep for your collection!')}
            </Heading>
          </StyledHero>
          <StyledNtfInfo>
            <NftProgress />
            <StatusCard />
          </StyledNtfInfo>
        </Container>
        <NftList />
        <HowItWorks />
      </Page>
    </NftProvider>
  )
}

export default Nft
