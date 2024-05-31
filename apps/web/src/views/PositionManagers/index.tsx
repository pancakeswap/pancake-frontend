import Page from 'components/Layout/Page'

import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { Header } from './components'
import { Controls, VaultContent } from './containers'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <Controls />
        <VaultContent />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}
