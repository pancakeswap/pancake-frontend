import { Order } from '@gelatonetwork/limit-orders-lib'
import { Flex, ChevronRightIcon, Text, Tag, Box, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useFormattedOrderData from 'views/LimitOrders/hooks/useFormattedOrderData'
import CurrencyFormat from './CurrencyFormat'
import { DetailLimitOrderModal } from './DetailLimitOrderModal'

interface CompactRowProps {
  order: Order
}

const CompactRow: React.FC<CompactRowProps> = ({ order }) => {
  const { t } = useTranslation()
  const formattedOrder = useFormattedOrderData(order)
  const {
    inputToken,
    outputToken,
    inputAmount,
    executionPrice,
    isOpen,
    isCancelled,
    isExecuted,
    isSubmissionPending,
    isCancellationPending,
  } = formattedOrder
  const [openDetailLimitOrderModal] = useModal(<DetailLimitOrderModal order={order} formattedOrder={formattedOrder} />)

  return (
    <Flex width="100%" justifyContent="center" alignItems="center" onClick={openDetailLimitOrderModal}>
      <Box width="100%">
        <Flex mb="16px">
          <CurrencyFormat bold currency={inputToken} />
          <ChevronRightIcon color="textSubtle" />
          <CurrencyFormat bold currency={outputToken} />
          {isOpen && isSubmissionPending && (
            <Tag outline scale="sm" variant="warning" ml="auto">
              {t('Pending')}
            </Tag>
          )}
          {isCancelled && !isCancellationPending && (
            <Tag outline scale="sm" variant="failure" ml="auto">
              {t('Canceled')}
            </Tag>
          )}
          {isCancellationPending && (
            <Tag outline scale="sm" variant="warning" ml="auto">
              {t('Cancelling')}
            </Tag>
          )}
          {isExecuted && (
            <Tag outline scale="sm" variant="success" ml="auto">
              {t('Filled')}
            </Tag>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('Amount')}
          </Text>
          <Text small textTransform="uppercase">{`${inputAmount?.toSignificant(4)} ${inputToken?.symbol}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
            {t('Price')}
          </Text>
          <Text small>{`${executionPrice?.toSignificant(4)} ${inputToken?.symbol}/${outputToken?.symbol}`}</Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default CompactRow
