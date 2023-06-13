import { ToggleView, ViewMode } from '@pancakeswap/uikit'
import { useState } from 'react'

import Page from 'components/Layout/Page'

import { Header, ControlsContainer, LiveSwitch } from './components'

export function PositionManagers() {
  const [viewMode, setViewMode] = useState(ViewMode.TABLE)

  return (
    <>
      <Header />
      <Page>
        <ControlsContainer>
          <ToggleView idPrefix="positionManagers" viewMode={viewMode} onToggle={setViewMode} />
          <LiveSwitch />
        </ControlsContainer>
      </Page>
    </>
  )
}
