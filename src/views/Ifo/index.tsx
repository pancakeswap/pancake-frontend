import React from 'react'
import Page from 'components/layout/Page'
import Container from 'components/layout/Container'
import IfoCard, { Ifo as IfoType } from './components/IfoCard'

const ifo: IfoType = {
  id: 'blink',
  status: 'coming_soon',
  name: 'BLINk (BLINK)',
  subTitle: 'Blink and it will be gone',
  description: 'Project is a strong project, with a good team, solid roadmap, and probably will not be an exit scam.',
  launchDate: 'Nov. 20',
  launchTime: '3PM JST',
  saleAmount: '300,000 BLINK',
  raiseAmount: '$100,000,000',
  cakeToBurn: '$500,000',
  projectSiteUrl: 'https://pancakeswap.finance',
}

const Ifo = () => {
  return (
    <Page>
      <Container>
        <div style={{ padding: '48px 0', width: '437px' }}>
          <IfoCard ifo={ifo} />
        </div>
      </Container>
    </Page>
  )
}

export default Ifo
