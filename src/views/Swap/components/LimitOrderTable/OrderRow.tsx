import { Trade } from '@pancakeswap/sdk'
import { Flex, ChevronRightIcon, Text, Tag, Box } from '@pancakeswap/uikit'
import CurrencyFormat from './CurrencyFormat'
import { useTranslation } from 'contexts/Localization'

interface OrderTableProps {
  inline: boolean
  onClick?: (ent) => void
  order: Trade
}

const OrderRow: React.FC<OrderTableProps> = ({ inline, onClick, order }) => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" justifyContent="center" alignItems="center" onClick={onClick}>
      <Box width="100%">
        <Flex mb="16px">
          <CurrencyFormat bold currency={order.inputAmount.currency} />
          <ChevronRightIcon color="textSubtle" />
          <CurrencyFormat bold currency={order.outputAmount.currency} />
          {!inline && (
            <Tag outline scale="sm" variant="failure" ml="auto">
              {t('Canceled')}
            </Tag>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text textTransform="uppercase">{t('Amount')}</Text>
          <Text textTransform="uppercase">{`1,234.12 ${order.inputAmount.currency?.symbol}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textTransform="uppercase">{t('Price')}</Text>
          <Text>{`0.0025 ${order.inputAmount.currency?.symbol}/${order.outputAmount.currency?.symbol}`}</Text>
        </Flex>
      </Box>
      {inline && (
        <Tag outline scale="sm" variant="failure" ml="24px">
          {t('Canceled')}
        </Tag>
      )}
    </Flex>
  )
}

export default OrderRow
