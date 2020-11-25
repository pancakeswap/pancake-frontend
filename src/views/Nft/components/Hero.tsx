import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import Container from 'components/layout/Container'
import useI18n from 'hooks/useI18n'

const StyledHero = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Cta = styled.div`
  align-items: center;
  display: flex;

  & > a + a {
    margin-left: 16px;
  }
`

const Hero = () => {
  const TranslateString = useI18n()

  return (
    <Container>
      <StyledHero>
        <Heading as="h1" size="xxl" color="secondary" mb="24px">
          {TranslateString(999, 'NFTs')}
        </Heading>
        <Heading as="h2" size="lg" color="secondary" mb="16px">
          {TranslateString(999, 'Trade in for CAKE, or keep for your collection!')}
        </Heading>
        <Text mb="24px">{TranslateString(999, 'Register your interest in winning an NFT below.')}</Text>
        <Cta>
          <Button as="a">{TranslateString(999, 'Register for a chance to win')}</Button>
          <Button as="a" variant="secondary">
            {TranslateString(999, 'Learn more')}
          </Button>
        </Cta>
      </StyledHero>
    </Container>
  )
}

export default Hero
