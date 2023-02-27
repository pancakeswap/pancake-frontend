import { BunnyPlaceholderIcon, Flex, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { ORDER_CATEGORY } from '../../types'

const NoOrdersMessage: React.FC<React.PropsWithChildren<{ orderCategory: ORDER_CATEGORY }>> = ({ orderCategory }) => {
  const { t } = useTranslation()

  const NoOrdersText = useMemo(() => {
    switch (orderCategory) {
      case ORDER_CATEGORY.Open:
        return t('No Open Orders')
      case ORDER_CATEGORY.History:
        return t('No Order History')
      case ORDER_CATEGORY.Expired:
        return t('No Expired Orders')
      default:
        return ''
    }
  }, [orderCategory, t])

  return (
    <Flex p="24px" justifyContent="center" alignItems="center" flexDirection="column">
      <BunnyPlaceholderIcon width={64} />
      <Text color="textDisabled">{NoOrdersText}</Text>
    </Flex>
  )
}

export default NoOrdersMessage
