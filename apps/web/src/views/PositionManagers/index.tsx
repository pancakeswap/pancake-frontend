import Page from 'components/Layout/Page'

import { FloatingExplorerHealthIndicator } from 'components/ApiHealthIndicator/FloatingExplorerHealthIndicator'
import { Header } from './components'
import { Controls, VaultContent } from './containers'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <Controls />
        <VaultContent />
        <FloatingExplorerHealthIndicator protocol="v3" />
      </Page>
    </>
  )
}
