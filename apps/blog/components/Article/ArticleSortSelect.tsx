import { Box, Text, Select, OptionProps } from '@pancakeswap/uikit'

interface SortByItem {
  label: string
  value: string
}

interface ArticleSortSelectProps {
  title: string
  options: SortByItem[]
  setOption: (value: string) => void
}

const ArticleSortSelect: React.FC<React.PropsWithChildren<ArticleSortSelectProps>> = ({
  title,
  options,
  setOption,
}) => {
  const handleChange = (newOption: OptionProps) => {
    setOption(newOption.value)
  }

  return (
    <Box minWidth="165px">
      <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
        {title}
      </Text>
      <Select options={options} onOptionChange={handleChange} />
    </Box>
  )
}

export default ArticleSortSelect
