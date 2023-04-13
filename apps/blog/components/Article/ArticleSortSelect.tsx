import { Box, Text, Select, OptionProps } from '@pancakeswap/uikit'
import { useMemo } from 'react'

interface SortByItem {
  label: string
  value: string
}

interface ArticleSortSelectProps {
  title: string
  key?: string
  options: SortByItem[]
  setOption: (value: string) => void
}

const ArticleSortSelect: React.FC<React.PropsWithChildren<ArticleSortSelectProps>> = ({
  title,
  key,
  options,
  setOption,
}) => {
  const handleChange = (newOption: OptionProps) => {
    setOption(newOption.value)
  }

  const placeHolderText = useMemo(() => options.find((i) => i.value === key), [key, options])

  return (
    <Box minWidth="165px">
      <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
        {title}
      </Text>
      <Select placeHolderText={key ? placeHolderText?.label : ''} options={options} onOptionChange={handleChange} />
    </Box>
  )
}

export default ArticleSortSelect
