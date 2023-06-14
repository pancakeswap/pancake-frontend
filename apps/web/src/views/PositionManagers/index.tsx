import Page from 'components/Layout/Page'

import { Header, ControlsContainer, LiveSwitch, ViewSwitch, StakeOnlyToggle, BoosterToggle } from './components'

export function PositionManagers() {
  return (
    <>
      <Header />
      <Page>
        <ControlsContainer>
          <ViewSwitch />
          <StakeOnlyToggle />
          <BoosterToggle />
          <LiveSwitch />
        </ControlsContainer>
      </Page>
    </>
  )
}
