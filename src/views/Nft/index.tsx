import React from 'react'
import styled from 'styled-components'
import { BaseLayout } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import NftCard from './components/NftCard'

const Grid = styled(BaseLayout)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  margin: 0 auto 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Nft = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero />
      <Container>
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
