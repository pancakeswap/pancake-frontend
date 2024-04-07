import {
  Box,
  BscScanIcon,
  Button,
  ChevronRightIcon,
  Flex,
  InjectedModalProps,
  Modal,
  Tag,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { ConfirmationPendingContent, TransactionErrorContent } from '@pancakeswap/widgets-internal'

import { Order } from '@gelatonetwork/limit-orders-lib'
import { useTranslation } from '@pancakeswap/localization'
import { TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import useGelatoLimitOrdersHandlers from 'hooks/limitOrders/useGelatoLimitOrdersHandlers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { memo, useCallback, useState } from 'react'
import { styled } from 'styled-components'
import { FormattedOrderData } from 'views/LimitOrders/hooks/useFormattedOrderData'
import LimitOrderDisclaimer from '../LimitOrderDisclaimer'
import CellFormat from './CellFormat'
import CurrencyFormat from './CurrencyFormat'

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

export const DetailLimitOrderModal: React.FC<React.PropsWithChildren<DetailLimitOrderModalProps>> = ({
  onDismiss,
  order,
  formattedOrder,
}) => {
  const { chainId } = useActiveChainId()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { handleLimitOrderCancellation } = useGelatoLimitOrdersHandlers()
  const { isMobile } = useMatchBreakpoints()

  const [{ cancellationErrorMessage, attemptingTxn, txHash }, setCancellationState] = useState<{
    attemptingTxn: boolean
    cancellationErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    cancellationErrorMessage: undefined,
    txHash: undefined,
  })

  const onCancelOrder = useCallback(() => {
    if (!handleLimitOrderCancellation) {
      return
    }
    setCancellationState({
      attemptingTxn: true,
      cancellationErrorMessage: undefined,
      txHash: undefined,
    })

    const orderDetails =
      formattedOrder.inputToken?.symbol &&
      formattedOrder.outputToken?.symbol &&
      formattedOrder.inputAmount &&
      formattedOrder.outputAmount
        ? {
            inputTokenSymbol: formattedOrder.inputToken.symbol,
            outputTokenSymbol: formattedOrder.outputToken.symbol,
            inputAmount: formattedOrder.inputAmount,
            outputAmount: formattedOrder.outputAmount,
          }
        : undefined
    handleLimitOrderCancellation(order, orderDetails)
      .then(({ hash }) => {
        setCancellationState({
          attemptingTxn: false,
          cancellationErrorMessage: undefined,
          txHash: hash,
        })
      })
      .catch((error) => {
        setCancellationState({
          attemptingTxn: false,
          cancellationErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    handleLimitOrderCancellation,
    formattedOrder.inputAmount,
    formattedOrder.outputAmount,
    formattedOrder.inputToken?.symbol,
    formattedOrder.outputToken?.symbol,
    order,
  ])

  const limitPriceExchangeRateText = `1 ${formattedOrder.inputToken?.symbol} = ${formattedOrder.executionPrice} ${formattedOrder.outputToken?.symbol}`
  const limitPriceExchangeRateTextReversed = `1 ${formattedOrder.outputToken?.symbol} = ${formattedOrder.invertedExecutionPrice} ${formattedOrder.inputToken?.symbol}`

  const { isOpen, isExecuted, isExpired, isCancelled, isSubmissionPending, isCancellationPending, bscScanUrls } =
    formattedOrder

  const orderDetails = (
    <>
      <Flex width="100%" justifyContent="space-between">
        <CellFormat
          firstRow={<Text>{formattedOrder.inputAmount}</Text>}
          secondRow={<CurrencyFormat currency={formattedOrder.inputToken} />}
        />
        <ChevronRightIcon />
        <CellFormat
          firstRow={<Text>{formattedOrder.outputAmount}</Text>}
          secondRow={<CurrencyFormat currency={formattedOrder.outputToken} />}
        />
      </Flex>
      <LimitTradeInfoCard
        limitPriceExchangeRateText={limitPriceExchangeRateText}
        limitPriceExchangeRateTextReversed={limitPriceExchangeRateTextReversed}
        isOpen={isOpen}
        isExecuted={isExecuted}
        isExpired={isExpired}
        isCancelled={isCancelled}
        isSubmissionPending={isSubmissionPending}
        isCancellationPending={isCancellationPending}
      />
      <LimitOrderDisclaimer />
      <Flex flexDirection="column">
        {formattedOrder.bscScanUrls.created ? (
          isOpen || isExpired ? (
            <>
              <Button variant="primary" mt="16px" as="a" external href={formattedOrder.bscScanUrls.created}>
                {t('View on BscScan')}
                <BscScanIcon color="invertedContrast" ml="4px" />
              </Button>
              {!isSubmissionPending && (
                <Button variant="danger" mt="16px" onClick={onCancelOrder}>
                  {t('Cancel Order')}
                </Button>
              )}
            </>
          ) : (
            <Button variant="primary" mt="16px" as="a" external href={formattedOrder.bscScanUrls.created}>
              {t('View order creation on BSCScan')}
              <BscScanIcon color="invertedContrast" ml="4px" />
            </Button>
          )
        ) : null}
        {isCancelled && bscScanUrls.cancelled && (
          <Button variant="primary" mt="16px" as="a" external href={bscScanUrls.cancelled}>
            {t('View order cancellation on BSCScan')}
            <BscScanIcon color="invertedContrast" ml="4px" />
          </Button>
        )}
        {isExecuted && bscScanUrls.executed && (
          <Button variant="primary" mt="16px" as="a" external href={bscScanUrls.executed}>
            {t('View order execution on BSCScan')}
            <BscScanIcon color="invertedContrast" ml="4px" />
          </Button>
        )}
      </Flex>
    </>
  )
  return (
    <Modal
      title={t('Open Order Details')}
      headerBackground={theme.colors.gradientCardHeader}
      style={{ width: isMobile ? '100%' : '436px' }}
      onDismiss={onDismiss}
    >
      {attemptingTxn ? (
        <ConfirmationPendingContent />
      ) : txHash ? (
        <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onDismiss} />
      ) : cancellationErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={cancellationErrorMessage} />
      ) : (
        orderDetails
      )}
    </Modal>
  )
}

interface LimitTradeInfoCardProps {
  limitPriceExchangeRateText: string
  limitPriceExchangeRateTextReversed: string
  isOpen: boolean
  isExecuted: boolean
  isExpired: boolean
  isCancelled: boolean
  isSubmissionPending: boolean
  isCancellationPending: boolean
}

const LimitTradeInfoCard: React.FC<React.PropsWithChildren<LimitTradeInfoCardProps>> = memo(
  ({
    limitPriceExchangeRateText,
    limitPriceExchangeRateTextReversed,
    isOpen,
    isExecuted,
    isExpired,
    isCancelled,
    isSubmissionPending,
    isCancellationPending,
  }) => {
    const { t } = useTranslation()

    return (
      <InfoCardWrapper>
        <Box mb="4px">
          {isOpen && isSubmissionPending && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="warning">
              {t('Pending')}
            </Tag>
          )}
          {isExpired && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="warning">
              {t('Expired')}
            </Tag>
          )}
          {isExecuted && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="success">
              {t('Filled')}
            </Tag>
          )}
          {isCancellationPending && (
            <Tag outline scale="sm" p="8px" mb="16px" variant="warning">
              {t('Cancelling')}
            </Tag>
          )}
          {isCancelled && !isCancellationPending && (
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
