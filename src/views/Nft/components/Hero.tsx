import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import Container from 'components/layout/Container'
import useI18n from 'hooks/useI18n'

const StyledHero = styled.div`
  padding-bottom: 32px;
  padding-top: 32px;
`
const Hero = () => {
  const TranslateString = useI18n()

  return (
    <StyledHero>
      <Container>
        <Heading as="h1" size="xxl" color="secondary" mb="24px">
          {TranslateString(999, 'NFTs')}
        </Heading>
        <Heading as="h2" size="lg" color="secondary" mb="24px">
          {TranslateString(999, 'Claim an NFT, then trade it in for CAKE or HODL it!')}
        </Heading>
        <Text mb="16px">
          {TranslateString(
            999,
            'If you’ve been randomly selected for a chance to win an NFT, you’ll be able to claim one NFT below.',
          )}
        </Text>
        <Text mb="16px">
          {TranslateString(999, 'Trade it in: Burn your NFT and receive CAKE')}
          <br />
          {TranslateString(999, 'HODL it: Just keep your NFT for fun and collection')}
        </Text>
        <Text mb="16px">
          {TranslateString(
            999,
            'But choose quickly! NFTs can only be traded in until the time stated on the card. Only a few wallets get a chance to claim an NFT for this series, so if you’ve been selected, choose wisely!',
          )}
        </Text>
      </Container>
    </StyledHero>
  )
}

export default Hero
