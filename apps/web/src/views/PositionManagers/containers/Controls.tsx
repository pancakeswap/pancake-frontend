import {
  ControlsContainer,
  LiveSwitch,
  ViewSwitch,
  StakeOnlyToggle,
  BoosterToggle,
  FilterContainer,
  SortFilter,
} from '../components'

export function Controls() {
  return (
    <ControlsContainer>
      <ViewSwitch />
      <StakeOnlyToggle />
      <BoosterToggle />
      <LiveSwitch />
      <FilterContainer>
        <SortFilter />
      </FilterContainer>
    </ControlsContainer>
  )
}
