import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Input, Text } from '@pancakeswap/uikit'
import React, { useEffect, useState } from 'react'

type FilterInputProps = {
  placeholder: string
  onChange: (value: string) => void
  hideLabel?: boolean
}

export const FilterFieldInput: React.FC<FilterInputProps> = ({ placeholder, onChange, hideLabel }) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState<string>('')
  const debouncedSearchText = useDebounce(search, 800)

  useEffect(() => {
    onChange(debouncedSearchText)
  }, [debouncedSearchText, onChange])

  return (
    <AutoColumn gap="4px">
      {!hideLabel && (
        <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
          {t('search')}
        </Text>
      )}
      <Input placeholder={placeholder} onChange={(e) => setSearch(e.target.value)} />
    </AutoColumn>
  )
}
