import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, OptionProps, Select, Text } from '@pancakeswap/uikit'
import React from 'react'

type FilterFieldSortProps = {
  onChange: (value: OptionProps['value']) => void
}

export enum SortOptions {
  Default = 'default',
  Vote = 'vote',
  Boost = 'boost',
}

export const FilterFieldSort: React.FC<FilterFieldSortProps> = ({ onChange }) => {
  const { t } = useTranslation()
  const SORT_OPTIONS: Array<OptionProps> = [
    { label: t('Default'), value: SortOptions.Default },
    { label: t('Vote'), value: SortOptions.Vote },
    { label: t('Boost'), value: SortOptions.Boost },
  ]

  return (
    <AutoColumn gap="4px">
      <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
        {t('sort by')}
      </Text>
      <Select
        style={{ minWidth: '100px' }}
        placeHolderText="default"
        options={SORT_OPTIONS}
        defaultOptionIndex={1}
        onOptionChange={(option) => onChange(option.value)}
      />
    </AutoColumn>
  )
}
