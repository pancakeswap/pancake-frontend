import Page from 'components/Layout/Page'
import { SubMenu } from 'views/PositionManagers/components/SubMenu'
import { Header } from './components'
import { Controls, VaultContent } from './containers'

export function PositionManagers() {
  return (
    <>
      <SubMenu />
      <Header />
      <Page>
        <Controls />
        <VaultContent />
      </Page>
    </>
  )
}
