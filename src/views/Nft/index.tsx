import React from 'react'
import styled from 'styled-components'
import { BaseLayout, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import Menu from './components/Menu'
import NftCard from './components/NftCard'
import InfoRow from './components/InfoRow'
import NftLink from './components/NftLink'

const Grid = styled(BaseLayout)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Header = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 32px;

  & > div {
    flex: 1;
  }
`

const Nft = () => {
  const seriesCount = 1
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero />
      <Container>
        <Menu />
        <Header>
          <div>
            <Heading size="xl">{TranslateString(999, `Series ${seriesCount}`)}</Heading>
          </div>
          <div>
            <InfoRow>
              <Text>{TranslateString(999, 'Total NFTs in series')}:</Text>
              <Text>
                <strong>500</strong>
              </Text>
            </InfoRow>
            <InfoRow>
              <Text>{TranslateString(999, 'Time left to trade in NFTs')}:</Text>
              <NftLink href="https://pancakeswap.finance">100 blocks left</NftLink>
            </InfoRow>
          </div>
        </Header>
        <Grid>
          <div>
            <NftCard />
          </div>
        </Grid>
      </Container>
    </Page>
  )
}

export default Nft
