import {
  ControlsContainer,
  LiveSwitch,
  ViewSwitch,
  StakeOnlyToggle,
  BoosterToggle,
  FilterContainer,
  SortFilter,
  SearchFilter,
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
        <SearchFilter />
      </FilterContainer>
    </ControlsContainer>
  )
}
