import Page from 'components/Layout/Page'

import { Header } from './components'
import { Controls, VaultContent } from './containers'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <Controls />
        <VaultContent />
      </Page>
    </>
  )
}
