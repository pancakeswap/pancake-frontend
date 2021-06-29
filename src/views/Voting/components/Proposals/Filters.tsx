import React, { ChangeEvent } from 'react'
import { Flex, Radio, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { ProposalState } from 'state/types'

interface FiltersProps {
  filterState: ProposalState
  onFilterChange: (filterState: ProposalState) => void
  isLoading: boolean
}

const StyledFilters = styled(Flex).attrs({ alignItems: 'center' })`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`

const FilterLabel = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-right: 16px;
`

const options = [
  { value: ProposalState.ACTIVE, label: 'Vote Now' },
  { value: ProposalState.PENDING, label: 'Soon' },
  { value: ProposalState.CLOSED, label: 'Closed' },
]

const Filters: React.FC<FiltersProps> = ({ filterState, onFilterChange, isLoading }) => {
  const { t } = useTranslation()

  return (
    <StyledFilters>
      {options.map(({ value, label }) => {
        const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
          const { value: radioValue } = evt.currentTarget
          onFilterChange(radioValue as ProposalState)
        }

        return (
          <FilterLabel key={label}>
            <Radio
              scale="sm"
              value={value}
              checked={filterState === value}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Text ml="8px">{t(label)}</Text>
          </FilterLabel>
        )
      })}
    </StyledFilters>
  )
}

export default Filters
