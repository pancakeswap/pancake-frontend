import Page from 'components/Layout/Page'

import { Header } from './components'
import { Controls, VaultCards } from './containers'

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
