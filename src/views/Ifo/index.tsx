import React from 'react'
import styled from 'styled-components'
import { Text, Heading, BaseLayout, Button } from '@pancakeswap-libs/uikit'
import { ifos } from 'sushi/lib/constants'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import IfoCard from './components/IfoCard'
import Title from './components/Title'

const LaunchIfoCallout = styled(BaseLayout)`
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto;
  max-width: 700px;
  padding: 32px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr;
  }
`

const IfoCardWrapper = styled.div`
  padding-bottom: 40px;
  padding-top: 40px;
`

const List = styled.ul`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;

  & > li {
    line-height: 1.4;
    margin-bottom: 8px;
  }
`

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifos.find((ifo) => ifo.isActive)

const Ifo = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero />
      <Container>
        <IfoCardWrapper>
          <IfoCard ifo={activeIfo} />
        </IfoCardWrapper>
        <LaunchIfoCallout>
          <div>
            <Title as="h2">{TranslateString(999, 'How to take part')}</Title>
            <Heading mb="16px">{TranslateString(999, 'Before Sale')}:</Heading>
            <List>
              <li>{TranslateString(999, 'Buy CAKE and BNB tokens')}</li>
              <li>{TranslateString(999, 'Get CAKE-BNB LP tokens by adding CAKEand BNB liquidity')}</li>
            </List>
            <Heading mb="16px">{TranslateString(999, 'During Sale')}:</Heading>
            <List>
              <li>
                {TranslateString(999, 'While the sale is live, commit your CAKE-LP toeksn to buy the IFO tokens')}
              </li>
            </List>
            <Heading mb="16px">{TranslateString(999, 'After Sale')}:</Heading>
            <List>
              <li>{TranslateString(999, 'Claim the tokens you bought, along with any unspent funds.')}</li>
              <li>{TranslateString(999, 'Done!')}</li>
            </List>
            <Text as="div" pt="16px">
              <Button
                as="a"
                variant="secondary"
                href="https://docs.pancakeswap.finance/core-products/ifo-initial-farm-offering"
              >
                {TranslateString(999, 'Read more')}
              </Button>
            </Text>
          </div>
          <div>
            <img src="/images/ifo-bunny.svg" alt="ifo bunny" />
            <div>
              <Title as="h2">{TranslateString(512, 'Want to launch your own IFO?')}</Title>
              <Text mb={3}>
                {TranslateString(
                  514,
                  'Launch your project with PancakeSwap, Binance Smart Chain’s most-used AMM project and liquidity provider, to bring your token directly to the most active and rapidly growing community on BSC.',
                )}
              </Text>
            </div>
          </div>
        </LaunchIfoCallout>
      </Container>
    </Page>
  )
}

export default Ifo
