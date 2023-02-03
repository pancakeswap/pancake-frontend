import { useMemo } from 'react'
import { Flex, Button } from '@pancakeswap/uikit'
import { Categories } from 'types'
import { useTranslation } from '@pancakeswap/localization'

interface CategoriesSelectorProps {
  selected: number
  categoriesData: Categories[]
  childMargin: string
  setSelected: (value: number) => void
}

const CategoriesSelector = ({ selected, categoriesData, childMargin, setSelected }: CategoriesSelectorProps) => {
  const { t } = useTranslation()

  const allCategories = useMemo(() => {
    const firstCategories = { id: 0, name: t('All') }
    return [firstCategories, ...categoriesData]
  }, [categoriesData, t])

  return (
    <Flex flexDirection={['row', 'row', 'row', 'row', 'row', 'row', 'column']}>
      {allCategories?.map((category) => (
        <Button
          key={category.id}
          scale="sm"
          display="block"
          width="fit-content"
          m={childMargin}
          variant={selected === category.id ? 'subtle' : 'light'}
          onClick={() => setSelected(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </Flex>
  )
}

export default CategoriesSelector
