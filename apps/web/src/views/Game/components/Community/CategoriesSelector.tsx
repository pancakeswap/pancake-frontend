import { useMemo } from 'react'
import { Flex, Button, Text } from '@pancakeswap/uikit'
import { Categories } from 'views/Home/types'
import { useTranslation } from '@pancakeswap/localization'

interface CategoriesSelectorProps {
  selected: number
  categoriesData: Categories[]
  childMargin: string
  setSelected: (value: number) => void
}

export const CategoriesSelector = ({ selected, categoriesData, childMargin, setSelected }: CategoriesSelectorProps) => {
  const { t } = useTranslation()

  const allCategories = useMemo(() => {
    const firstCategories = { id: 0, name: `${t('All')} (${categoriesData.length})` }
    return [firstCategories, ...categoriesData]
  }, [categoriesData, t])

  return (
    <Flex flexDirection={['row', 'row', 'row', 'row', 'row', 'row', 'column']}>
      {allCategories?.map((category) => {
        if (selected === category.id) {
          return (
            <Button
              key={category.id}
              scale="sm"
              display="block"
              width="fit-content"
              m={childMargin}
              variant="subtle"
              onClick={() => setSelected(category.id)}
            >
              {category.name}
            </Button>
          )
        }
        return (
          <Text
            key={category.id}
            display="block"
            width="fit-content"
            padding="0 16px"
            color="textSubtle"
            style={{ cursor: 'pointer' }}
          >
            {category.name}
          </Text>
        )
      })}
    </Flex>
  )
}
