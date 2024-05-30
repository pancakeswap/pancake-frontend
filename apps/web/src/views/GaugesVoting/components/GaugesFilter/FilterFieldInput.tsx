import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, InputGroup, SearchIcon, SearchInput, Text } from '@pancakeswap/uikit'
import React from 'react'

type FilterInputProps = {
  placeholder: string
  initialValue?: string
  onChange: (value: string) => void
  hideLabel?: boolean
}

export const FilterFieldInput: React.FC<FilterInputProps> = ({ placeholder, initialValue, onChange, hideLabel }) => {
  const { t } = useTranslation()

  return (
    <AutoColumn gap="4px">
      {!hideLabel && (
        <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
          {t('search')}
        </Text>
      )}
      <InputGroup startIcon={<SearchIcon style={{ zIndex: 1 }} color="textSubtle" width="18px" />}>
        <SearchInput placeholder={placeholder} initialValue={initialValue} onChange={(e) => onChange(e.target.value)} />
      </InputGroup>
    </AutoColumn>
  )
}
