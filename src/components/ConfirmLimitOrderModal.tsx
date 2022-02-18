import { Trade } from '@pancakeswap/sdk'
import { ArrowDownIcon, Button, Flex, Message, MessageText, Modal, Spinner, Text } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { memo, useState } from 'react'
import styled from 'styled-components'

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

interface ConfirmLimitOrderModalProps {
  trade: Trade
  onDismiss?: () => void
}

export const ConfirmLimitOrderModal: React.FC<ConfirmLimitOrderModalProps> = ({ onDismiss, trade }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <StyledModal
      title={isLoading ? t('Back') : t('Confirm Limit Order')}
      onBack={isLoading ? () => setIsLoading(false) : undefined}
      headerBackground={theme.colors.gradients.cardHeader}
      onDismiss={onDismiss}
      style={{ width: isLoading ? '375px' : '436px' }}
    >
      {isLoading ? <LoadingContent /> : <OrderContent trade={trade} />}
      <Button
        variant={isLoading ? 'secondary' : 'primary'}
        onClick={() => {
          setIsLoading(true)
        }}
        mt="24px"
        disabled={isLoading}
      >
        {isLoading ? t(`Confirming...`) : t(`Confirm`)}
      </Button>
    </StyledModal>
  )
}

interface OrderContentProps {
  trade: Trade
}

const OrderContent: React.FC<OrderContentProps> = ({ trade }) => {
  const { t } = useTranslation()
  return (
    <>
      <Flex flexDirection="column" width="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="24px" color="text">
            1200
          </Text>
          <Flex alignItems="center">
            <Text color="text" mr="8px">
              {trade.inputAmount.currency.symbol?.toUpperCase()}
            </Text>
            <CurrencyLogo currency={trade.inputAmount.currency} />
          </Flex>
        </Flex>
        <Flex justifyContent="center">
          <ArrowDownIcon />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="24px" color="text">
            3.04
          </Text>
          <Flex alignItems="center">
            <Text color="text" mr="8px">
              {trade.outputAmount.currency.symbol?.toUpperCase()}
            </Text>
            <CurrencyLogo currency={trade.outputAmount.currency} />
          </Flex>
        </Flex>
      </Flex>
      <LimitTradeInfoCard
        currentPriceExchangeRateText="0.002474 BNB = 1 BUSD"
        currentPriceExchangeRateTextReversed="404.11169 BUSD = 1 BNB"
        limitPriceExchangeRateText="0.002474 BNB = 1 BUSD"
        limitPriceExchangeRateTextReversed="404.11169 BUSD = 1 BNB"
      />
      <Message variant="success" mt="24px">
        <MessageText>
          {t(
            'Limit price is 12.12% above the current market rate. The order will be executed when the market price reaches the specified limit price within the expiration date, within your slippage parameters.',
          )}
        </MessageText>
      </Message>
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
