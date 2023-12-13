import { useMemo } from 'react'
import { Flex, Button, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GameCategoriesType } from 'hooks/useGameCategories'

interface CategoriesSelectorProps {
  selected: number
  categoriesData: GameCategoriesType[]
  childMargin: string
  setSelected: (value: number) => void
}

export const CategoriesSelector = ({ selected, categoriesData, childMargin, setSelected }: CategoriesSelectorProps) => {
  const { t } = useTranslation()

  const allCategories = useMemo(() => {
    const total = categoriesData.reduce((subTotal, item) => item.total + subTotal, 0)
    const firstCategories = { id: 0, total, name: `${t('All')} (${total})` }
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
            style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
            m={['0', '0', '0', '0', '0', '0', '36px 0 0 0']}
          >
            {`${category.name} (${category.total})`}
          </Text>
        )
      })}
    </Flex>
  )
}
