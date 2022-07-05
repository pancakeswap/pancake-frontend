import { Currency } from '@pancakeswap/sdk'
import {
  ArrowDownIcon,
  Button,
  Flex,
  InjectedModalProps,
  Message,
  MessageText,
  Modal,
  Spinner,
  Text,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { TransactionErrorContent, TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import styled from 'styled-components'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import LimitOrderDisclaimer from './LimitOrderDisclaimer'

const InfoCardWrapper = styled.div`
  border-radius: 16px;
  padding: 16px;
  margin-top: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

interface ConfirmLimitOrderModalProps extends InjectedModalProps {
  currencies: {
    input: Currency
    output: Currency
  }
  formattedAmounts: {
    input: string
    output: string
    price: string
  }
  currentMarketRate: string
  currentMarketRateInverted: string
  limitPrice: string
  limitPriceInverted: string
  percentageRateDifference: string
  onConfirm: () => void
  attemptingTxn: boolean
  txHash: string
  customOnDismiss: () => void
  swapErrorMessage: string
}

export const ConfirmLimitOrderModal: React.FC<ConfirmLimitOrderModalProps> = ({
  onDismiss,
  currencies,
  formattedAmounts,
  currentMarketRate,
  currentMarketRateInverted,
  limitPrice,
  limitPriceInverted,
  percentageRateDifference,
  onConfirm,
  attemptingTxn,
  txHash,
  customOnDismiss,
  swapErrorMessage,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const wrappedOutput = wrappedCurrency(currencies.output, chainId)

  const handleDismiss = () => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }
  return (
    <Modal
      title={t('Confirm Limit Order')}
      headerBackground={theme.colors.gradients.cardHeader}
      onDismiss={handleDismiss}
      style={{ width: '436px' }}
    >
      {attemptingTxn ? (
        <LoadingContent />
      ) : txHash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          currencyToAdd={wrappedOutput}
          onDismiss={handleDismiss}
        />
      ) : swapErrorMessage ? (
        <TransactionErrorContent onDismiss={handleDismiss} message={swapErrorMessage} />
      ) : (
        <OrderContent
          currencies={currencies}
          formattedAmounts={formattedAmounts}
          currentMarketRate={currentMarketRate}
          currentMarketRateInverted={currentMarketRateInverted}
          limitPrice={limitPrice}
          limitPriceInverted={limitPriceInverted}
          percentageRateDifference={percentageRateDifference}
        />
      )}
      {!txHash && !swapErrorMessage && (
        <Flex justifyContent="center" mt="24px">
          <Button scale="md" variant="primary" onClick={onConfirm} width="100%" disabled={attemptingTxn}>
            {attemptingTxn ? t(`Confirming...`) : t(`Confirm`)}
          </Button>
        </Flex>
      )}
    </Modal>
  )
}

interface OrderContentProps {
  currencies: {
    input: Currency
    output: Currency
  }
  formattedAmounts: {
    input: string
    output: string
    price: string
  }
  currentMarketRate: string
  currentMarketRateInverted: string
  limitPrice: string
  limitPriceInverted: string
  percentageRateDifference: string
}

const OrderContent: React.FC<OrderContentProps> = ({
  currencies,
  formattedAmounts,
  currentMarketRate,
  currentMarketRateInverted,
  limitPrice,
  limitPriceInverted,
  percentageRateDifference,
}) => {
  const { t } = useTranslation()
  const currentPriceExchangeRateText = `1 ${currencies.input?.symbol} = ${currentMarketRate} ${currencies.output?.symbol}`
  const currentPriceExchangeRateTextReversed = `1 ${currencies.output?.symbol} = ${currentMarketRateInverted} ${currencies.input?.symbol}`
  const limitPriceExchangeRateText = `1 ${currencies.input?.symbol} = ${limitPrice} ${currencies.output?.symbol}`
  const limitPriceExchangeRateTextReversed = `1 ${currencies.output?.symbol} = ${limitPriceInverted} ${currencies.input?.symbol}`
  return (
    <>
      <Flex flexDirection="column" width="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="24px" color="text">
            {formattedAmounts.input}
          </Text>
          <Flex alignItems="center">
            <Text textTransform="uppercase" color="text" mr="8px">
              {currencies.input?.symbol}
            </Text>
            <CurrencyLogo currency={currencies.input} />
          </Flex>
        </Flex>
        <Flex justifyContent="center">
          <ArrowDownIcon />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="24px" color="text">
            {formattedAmounts.output}
          </Text>
          <Flex alignItems="center">
            <Text textTransform="uppercase" color="text" mr="8px">
              {currencies.output?.symbol}
            </Text>
            <CurrencyLogo currency={currencies.output} />
          </Flex>
        </Flex>
      </Flex>
      <LimitTradeInfoCard
        currentPriceExchangeRateText={currentPriceExchangeRateText}
        currentPriceExchangeRateTextReversed={currentPriceExchangeRateTextReversed}
        limitPriceExchangeRateText={limitPriceExchangeRateText}
        limitPriceExchangeRateTextReversed={limitPriceExchangeRateTextReversed}
      />
      <Message variant="success" mt="24px">
        <MessageText>
          {t(
            'Limit price is %percentage%% above the current market rate. The order will be executed when the market price reaches high enough above your limit price (to also pay for limit order execution gas fees).',
            { percentage: percentageRateDifference },
          )}
        </MessageText>
      </Message>
      <LimitOrderDisclaimer />
    </>
  )
}

interface LimitTradeInfoCardProps {
  currentPriceExchangeRateText: string
  currentPriceExchangeRateTextReversed: string
  limitPriceExchangeRateText: string
  limitPriceExchangeRateTextReversed: string
}

const LimitTradeInfoCard: React.FC<LimitTradeInfoCardProps> = memo(
  ({
    currentPriceExchangeRateText,
    currentPriceExchangeRateTextReversed,
    limitPriceExchangeRateText,
    limitPriceExchangeRateTextReversed,
  }) => {
    const { t } = useTranslation()
    return (
      <InfoCardWrapper>
        <Flex justifyContent="space-between">
          <Text fontSize="14px" color="textSubtle">
            {t('Current Market Price')}
          </Text>
          <Flex flexDirection="column">
            <Text color="text" fontSize="14px" bold>
              {currentPriceExchangeRateText}
            </Text>
            <Text color="text" fontSize="14px">
              {currentPriceExchangeRateTextReversed}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" mt="16px">
          <Text fontSize="14px" color="textSubtle">
            {t('Limit Price')}
          </Text>
          <Flex flexDirection="column">
            <Text color="#129E7D" fontSize="14px" bold>
              {limitPriceExchangeRateText}
            </Text>
            <Text color="#129E7D" fontSize="14px">
              {limitPriceExchangeRateTextReversed}
            </Text>
          </Flex>
        </Flex>
      </InfoCardWrapper>
    )
  },
)

const LoadingContent: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <Flex>
      <Flex flexDirection="column" flexGrow="wrap" flexBasis="267px">
        <Text fontSize="20px" small color="secondary">
          {t('Confirm')}
        </Text>
        <Text small color="textSubtle" mt="8px">
          {t('Please confirm the transaction in your wallet')}
        </Text>
      </Flex>
      <Flex>
        <Spinner size={70} />
      </Flex>
    </Flex>
  )
})
