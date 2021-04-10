import React from 'react'
import styled from 'styled-components'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import Container from 'components/layout/Container'
import useI18n from 'hooks/useI18n'

const StyledHero = styled.div`
  background-image: linear-gradient(180deg, #53dee9 0%, #1fc7d4 100%);
  padding-bottom: 40px;
  padding-top: 40px;
  margin-bottom: 32px;
`
const Hero = () => {
  const TranslateString = useI18n()

  return (
    <StyledHero>
      <Container>
        <Heading as="h1" size="xl" mb="24px">
          {TranslateString(500, 'IFO: Initial Farm Offerings')}
        </Heading>
        <Text bold fontSize="20px">
          {TranslateString(502, 'Buy new tokens with a brand new token sale model.')}
        </Text>
      </Container>
    </StyledHero>
  )
}

export default Hero
