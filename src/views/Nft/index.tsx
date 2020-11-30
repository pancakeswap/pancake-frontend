import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import HowItWorks from './components/HowItWorks'
import NftInfo from './components/NftInfo'

const StyledHero = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Nft = () => {
  const TranslateString = useI18n()

  return (
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
      </Container>
      <NftInfo />
      <HowItWorks />
    </Page>
  )
}

export default Nft
