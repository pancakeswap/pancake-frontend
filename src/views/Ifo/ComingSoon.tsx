// @ts-nocheck
import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@pancakeswap-libs/uikit'
import { Link } from 'react-router-dom'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'

const Hero = styled.div`
  background-image: linear-gradient(180deg, #53dee9 0%, #1fc7d4 100%);
  padding-bottom: 40px;
  padding-top: 40px;
  margin-bottom: 32px;
`

const Title = styled(Heading).attrs({ as: 'h1', size: 'xl' })`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 24px;
`

const Blurb = styled(Text)`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
`

const Content = styled(Container)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr minmax(auto, 436px);
  }
`

const Subtitle = styled(Heading).attrs({ as: 'h2', size: 'lg' })`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 16px;
`

const Block = styled.div`
  margin-bottom 32px;
`

const MainImage = styled.img`
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const MobileImage = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 136px;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const LiquidityLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
`

const ComingSoon = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero>
        <Container>
          <Title>{TranslateString(999, 'IFO: Initial Farm Offerings')}</Title>
          <Blurb>{TranslateString(999, 'Buy new tokens with a brand new token sale model.')}</Blurb>
        </Container>
      </Hero>
      <Content>
        <div>
          <Block>
            <Subtitle>{TranslateString(999, 'Coming Soon to PancakeSwap.')}</Subtitle>
            <Text mb={3}>
              {TranslateString(
                999,
                'You’ll pay for the new tokens using CAKE-BNB LP tokens, which means you need to stake equal amounts of CAKE and BNB in a liquidity pool to take part.',
              )}
            </Text>
            <Text mb={3}>
              <LiquidityLink to="https://exchange.pancakeswap.finance/#/add/ETH/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82">
                {TranslateString(999, 'Get CAKE-BNB LP >')}
              </LiquidityLink>
            </Text>
            <Text mb={3}>
              {TranslateString(999, 'The project gets the BNB, PancakeSwap burns the CAKE.')}
              <br />
              <strong>{TranslateString(999, 'You get the tokens.')}</strong>
            </Text>
          </Block>
          <MobileImage src="/images/ifo-bunny.svg" alt="ifo bunny" />
          <Block>
            <Subtitle>{TranslateString(999, 'Want to launch your own IFO?')}</Subtitle>
            <Text mb={3}>
              {TranslateString(
                999,
                'Launch your project with PancakeSwap, Binance Smart Chain’s most-used AMM project and liquidity provider, to bring your token directly to the most active and rapidly growing community on BSC.',
              )}
            </Text>
            <Button
              as="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLScGdT5rrVMr4WOWr08pvcroSeuIOtEJf1sVdQGVdcAOqryigQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              {TranslateString(999, 'Apply to launch')}
            </Button>
          </Block>
        </div>
        <div>
          <MainImage src="/images/ifo-bunny.svg" alt="ifo bunny" />
        </div>
      </Content>
    </Page>
  )
}

export default ComingSoon
