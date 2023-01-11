import { Box, Text, Select, OptionProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ArticleSortSelectProps {
  setSortBy: (value: string) => void
}

const ArticleSortSelect: React.FC<React.PropsWithChildren<ArticleSortSelectProps>> = ({ setSortBy }) => {
  const { t } = useTranslation()

  const sortByItems = [
    { label: t('Date'), value: 'date' },
    { label: t('Sort Title A-Z'), value: 'asc' },
    { label: t('Sort Title Z-A'), value: 'desc' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <Box minWidth="165px">
      <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
        {t('Sort By')}
      </Text>
      <Select options={sortByItems} onOptionChange={handleChange} />
    </Box>
  )
}

export default ArticleSortSelect
