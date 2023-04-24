import { Box, Text, Select, OptionProps } from '@pancakeswap/uikit'
import { useMemo } from 'react'

interface SortByItem {
  label: string
  value: string
}

interface ArticleSortSelectProps {
  title: string
  value?: string
  options: SortByItem[]
  setOption: (value: string) => void
}

const ArticleSortSelect: React.FC<React.PropsWithChildren<ArticleSortSelectProps>> = ({
  title,
  value,
  options,
  setOption,
}) => {
  const handleChange = (newOption: OptionProps) => {
    setOption(newOption.value)
  }

  const placeHolderText = useMemo(() => options.find((i) => i.value === value), [value, options])

  return (
    <Box minWidth="165px">
      <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
        {title}
      </Text>
      <Select placeHolderText={value ? placeHolderText?.label : ''} options={options} onOptionChange={handleChange} />
    </Box>
  )
}

export default ArticleSortSelect
