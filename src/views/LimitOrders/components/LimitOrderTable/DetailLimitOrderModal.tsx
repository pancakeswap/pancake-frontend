import { Button, Flex, Box, Modal, Text, ChevronRightIcon, InjectedModalProps, Tag } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import styled from 'styled-components'
import { mainnetTokens } from 'config/constants/tokens'
import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'
import { FormattedOrderData } from 'views/LimitOrders/hooks/useFormattedOrderData'
import useGelatoLimitOrdersHandlers from 'hooks/limitOrders/useGelatoLimitOrdersHandlers'
import { Order } from '@gelatonetwork/limit-orders-lib'

const StyledModal = styled(Modal)`
  max-width: 613px;
`

const InfoCardWrapper = styled.div`
  border-radius: 16px;
  padding: 16px;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

interface DetailLimitOrderModalProps extends InjectedModalProps {
  order: Order
  // Just pass it to modal to prevent recalculating everything
  formattedOrder: FormattedOrderData
}

export const DetailLimitOrderModal: React.FC<DetailLimitOrderModalProps> = ({ onDismiss, order, formattedOrder }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { handleLimitOrderCancellation } = useGelatoLimitOrdersHandlers()

  const onCancelOrder = () => {
    handleLimitOrderCancellation(order)
  }

  const limitPriceExchangeRateText = `1 ${
    formattedOrder.inputToken?.symbol
  } = ${formattedOrder.executionPrice?.toSignificant(4)} ${formattedOrder.outputToken?.symbol}`
  const limitPriceExchangeRateTextReversed = `1 ${formattedOrder.outputToken?.symbol} = ${formattedOrder.executionPrice
    ?.invert()
    .toSignificant(4)} ${formattedOrder.inputToken?.symbol}`

  const isOpen = !formattedOrder.isExecuted && !formattedOrder.isCancelled

  return (
    <StyledModal
      title={t('Open Order Details')}
      headerBackground={theme.colors.gradients.cardHeader}
      style={{ width: '436px' }}
      onDismiss={onDismiss}
    >
      <Flex width="100%" justifyContent="space-between">
        <CellFormat
          firstRow={formattedOrder.inputAmount?.toSignificant(4)}
          secondRow={<CurrencyFormat currency={formattedOrder.inputToken} />}
        />
        <ChevronRightIcon />
        <CellFormat
          firstRow={formattedOrder.outputAmount?.toSignificant(4)}
          secondRow={<CurrencyFormat currency={formattedOrder.outputToken} />}
        />
      </Flex>
      <LimitTradeInfoCard
        currentPriceExchangeRateText="0.002474 BNB = 1 BUSD"
        currentPriceExchangeRateTextReversed="404.11169 BUSD = 1 BNB"
        limitPriceExchangeRateText={limitPriceExchangeRateText}
        limitPriceExchangeRateTextReversed={limitPriceExchangeRateTextReversed}
        isExecuted={formattedOrder.isExecuted}
        isCancelled={formattedOrder.isCancelled}
      />
      {isOpen ? (
        <>
          <Button variant="primary" mt="24px" as="a" external href={formattedOrder.bscScanUrls.created}>
            {t('View on BSCScan')}
          </Button>
          <Button variant="danger" mt="24px" onClick={onCancelOrder}>
            {t('Cancel Order')}
          </Button>
        </>
      ) : (
        <Button variant="primary" mt="24px" as="a" external href={formattedOrder.bscScanUrls.created}>
          {t('View order creation on BSCScan')}
        </Button>
      )}
      {formattedOrder.isCancelled && formattedOrder.bscScanUrls.cancelled && (
        <Button variant="primary" mt="24px" as="a" external href={formattedOrder.bscScanUrls.cancelled}>
          {t('View order cancellation on BSCScan')}
        </Button>
      )}
      {formattedOrder.isExecuted && formattedOrder.bscScanUrls.executed && (
        <Button variant="primary" mt="24px" as="a" external href={formattedOrder.bscScanUrls.executed}>
          {t('View order execution on BSCScan')}
        </Button>
      )}
    </StyledModal>
  )
}

interface LimitTradeInfoCardProps {
  currentPriceExchangeRateText: string
  currentPriceExchangeRateTextReversed: string
  limitPriceExchangeRateText: string
  limitPriceExchangeRateTextReversed: string
  isExecuted: boolean
  isCancelled: boolean
}

const LimitTradeInfoCard: React.FC<LimitTradeInfoCardProps> = memo(
  ({ limitPriceExchangeRateText, limitPriceExchangeRateTextReversed, isExecuted, isCancelled }) => {
    const { t } = useTranslation()

    return (
      <InfoCardWrapper>
        <Box mb="4px">
          {isExecuted && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="success">
              {t('Filled')}
            </Tag>
          )}
          {isCancelled && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="failure">
              {t('Cancelled')}
            </Tag>
          )}
          <Text fontSize="14px" color="textSubtle">
            {t('Limit Price')}
          </Text>
          <Flex flexDirection="column">
            <Text fontSize="14px">{limitPriceExchangeRateText}</Text>
            <Text fontSize="14px">{limitPriceExchangeRateTextReversed}</Text>
          </Flex>
        </Box>
      </InfoCardWrapper>
    )
  },
)
