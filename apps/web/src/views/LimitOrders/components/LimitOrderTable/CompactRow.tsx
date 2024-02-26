import { Order } from '@gelatonetwork/limit-orders-lib'
import { Flex, ChevronRightIcon, Text, Box, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useFormattedOrderData from 'views/LimitOrders/hooks/useFormattedOrderData'
import CurrencyFormat from './CurrencyFormat'
import { DetailLimitOrderModal } from './DetailLimitOrderModal'
import OrderStatus from './OrderStatus'

interface CompactRowProps {
  order: Order
}

const CompactRow: React.FC<React.PropsWithChildren<CompactRowProps>> = ({ order }) => {
  const { t } = useTranslation()
  const formattedOrder = useFormattedOrderData(order)
  const { inputToken, outputToken, inputAmount, outputAmount, executionPrice } = formattedOrder
  const [openDetailLimitOrderModal] = useModal(<DetailLimitOrderModal order={order} formattedOrder={formattedOrder} />)

  return (
    <Flex width="100%" justifyContent="center" alignItems="center" onClick={openDetailLimitOrderModal}>
      <Box width="100%">
        <Flex mb="16px">
          <CurrencyFormat bold currency={inputToken} />
          <ChevronRightIcon color="textSubtle" />
          <CurrencyFormat bold currency={outputToken} />
          <OrderStatus formattedOrder={formattedOrder} />
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('From')}
          </Text>
          <Text small textTransform="uppercase">{`${inputAmount} ${inputToken?.symbol}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('To')}
          </Text>
          <Text small textTransform="uppercase">{`${outputAmount} ${outputToken?.symbol}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('Price')}
          </Text>
          <Text small>
            {`${executionPrice} ${t('%assetA% per %assetB%', {
              assetA: outputToken?.symbol ?? '',
              assetB: inputToken?.symbol ?? '',
            })}`}
          </Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default CompactRow
