import React from 'react'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import PleaseWaitCard from './components/PleaseWaitCard'
import NoNftsToClaimCard from './components/NoNftsToClaimCard'
import YouWonCard from './components/YouWonCard'
import NftInWalletCard from './components/NftInWalletCard'

const Nft = () => {
  return (
    <Page>
      <Hero />
      <div style={{ paddingBottom: '32px', paddingTop: '32px' }}>
        <Container>
          <div style={{ marginBottom: '16px' }}>
            <PleaseWaitCard />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <NoNftsToClaimCard />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <YouWonCard />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <NftInWalletCard />
          </div>
        </Container>
      </div>
      <HowItWorks />
    </Page>
  )
}

export default Nft
