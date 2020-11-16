import React from 'react'
import styled from 'styled-components'
import { Text, BaseLayout } from '@pancakeswap-libs/uikit'
import { ifos } from 'sushi/lib/constants'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import IfoCard from './components/IfoCard'
import Title from './components/Title'

const Content = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  padding: 32px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: minmax(auto, 437px) 1fr;
  }
`

const Bunny = styled.img`
  margin-bottom: 16px;
`

const LaunchIfoCallout = styled(BaseLayout)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto;
  max-width: 700px;
  padding: 32px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: minmax(auto, 224px) 1fr;
  }
`

const Explanation = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
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
        <Content>
          <IfoCard ifo={activeIfo} />
          <div>
            <Bunny src="/images/bunny-question.svg" alt="your ifo bunny" />
            <Title>{TranslateString(999, 'How to take part')}</Title>
            <Explanation>Text that will change soon</Explanation>
          </div>
        </Content>
        <LaunchIfoCallout>
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
        </LaunchIfoCallout>
      </Container>
    </Page>
  )
}

export default Ifo
