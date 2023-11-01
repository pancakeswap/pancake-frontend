import Page from 'components/Layout/Page'

import { Header } from './components'
import { VaultCards, Controls } from './containers'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <Controls />
        <VaultCards />
      </Page>
    </>
  )
}
