import { Categories } from '@pancakeswap/blog'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex } from '@pancakeswap/uikit'
import { useMemo } from 'react'

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
    const sortData = categoriesData.sort((i) => (i.name === 'V4' ? -1 : 1))
    return [firstCategories, ...sortData]
  }, [categoriesData, t])

  return (
    <Flex flexDirection={['row', 'row', 'row', 'row', 'row', 'column', 'column']}>
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
