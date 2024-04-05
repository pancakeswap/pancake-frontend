import { useMatchBreakpoints } from '@pancakeswap/uikit'

import {
  ControlGroup,
  ControlsContainer,
  LiveSwitch,
  SearchFilter,
  SortFilter,
  StakeOnlyToggle,
  ViewSwitch,
} from '../components'

export function Controls() {
  const { isDesktop } = useMatchBreakpoints()

  const controls = isDesktop ? (
    <ControlsContainer>
      <ControlGroup>
        <ViewSwitch />
        <StakeOnlyToggle />
        <LiveSwitch />
      </ControlGroup>
      <ControlGroup justifyContent="flex-end">
        <SortFilter />
        <SearchFilter />
      </ControlGroup>
    </ControlsContainer>
  ) : (
    <ControlsContainer justifyContent="flex-start" flexDirection="column">
      <ControlGroup>
        <ViewSwitch />
        <StakeOnlyToggle />
      </ControlGroup>
      <ControlGroup justifyContent="flex-start">
        <LiveSwitch />
      </ControlGroup>
      <ControlGroup>
        <SortFilter />
        <SearchFilter />
      </ControlGroup>
    </ControlsContainer>
  )

  return controls
}
