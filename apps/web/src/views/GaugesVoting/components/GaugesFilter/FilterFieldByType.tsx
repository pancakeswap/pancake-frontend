import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Button, FlexGap, Text } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'
import { OptionsType } from './type'

const FilterButton = styled(Button)`
  height: 35px;
  border-radius: 18px;
  padding: 0 12px;
  white-space: nowrap;
`

type FilterButtonGroupProps = {
  onFilterChange: (filter: OptionsType) => void
}

export const FilterFieldByType: React.FC<FilterButtonGroupProps> = ({ onFilterChange }) => {
  const { t } = useTranslation()

  return (
    <AutoColumn gap="4px">
      <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
        {t('filter')}
      </Text>
      <FlexGap gap="10px">
        <FilterButton variant="light" onClick={() => onFilterChange(OptionsType.ByChain)}>
          {t('Chain')}
        </FilterButton>
        <FilterButton variant="light" onClick={() => onFilterChange(OptionsType.ByFeeTier)}>
          {t('Fee Tier')}
        </FilterButton>
        <FilterButton variant="light" onClick={() => onFilterChange(OptionsType.ByType)}>
          {t('Type')}
        </FilterButton>
      </FlexGap>
    </AutoColumn>
  )
}
