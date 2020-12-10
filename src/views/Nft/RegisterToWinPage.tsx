// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import HowItWorks from './components/HowItWorks'
import NftPreview from './components/NftPreview'

const StyledHero = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  padding-bottom: 32px;
  padding-top: 32px;
  margin-bottom: 24px;
`

const Cta = styled.div`
  align-items: center;
  display: flex;

  & > a + a {
    margin-left: 16px;
  }
`

const RegisterToWinPage = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Container>
        <StyledHero>
          <Heading as="h1" size="xxl" color="secondary" mb="24px">
            NFTs
          </Heading>
          <Heading as="h2" size="lg" color="secondary" mb="16px">
            {TranslateString(614, 'Trade in for CAKE, or keep for your collection!')}
          </Heading>
          <Text mb="24px">{TranslateString(616, 'Register your interest in winning an NFT below.')}</Text>
          <Cta>
            <Button
              as="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfToBNlovtMvTZFSwOhk0TBiDPMGasLxqG0RB-kJN85HR_avA/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              {TranslateString(618, 'Register for a chance to win')}
            </Button>
            <Button as="a" href="#how-it-works" variant="secondary">
              {TranslateString(620, 'Learn more')}
            </Button>
          </Cta>
        </StyledHero>
      </Container>
      <NftPreview />
      <HowItWorks />
    </Page>
  )
}

export default RegisterToWinPage
