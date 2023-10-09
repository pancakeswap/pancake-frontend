import Page from 'components/Layout/Page'

import { Header, ControlsContainer, LiveSwitch, ViewSwitch } from './components'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <ControlsContainer>
          <ViewSwitch />
          <LiveSwitch />
        </ControlsContainer>
      </Page>
    </>
  )
}
