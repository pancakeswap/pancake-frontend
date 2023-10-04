import Page from 'components/Layout/Page'

import { Header } from './components'
import { VaultCards } from './containers'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <VaultCards />
      </Page>
    </>
  )
}
