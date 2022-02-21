import { Button, Flex, Box, Modal, Text, ChevronRightIcon, InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'
import styled from 'styled-components'
import { mainnetTokens } from 'config/constants/tokens'
import CurrencyFormat from './CurrencyFormat'
import CellFormat from './CellFormat'

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

export const DetailLimitOrderModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <StyledModal
      title={t('Open Order Details')}
      headerBackground={theme.colors.gradients.cardHeader}
      style={{ width: '436px' }}
      onDismiss={onDismiss}
    >
      <OrderContent />
      <Button variant="primary" mt="24px">
        {t('View on BSCScan')}
      </Button>
      <Button variant="secondary" mt="24px">
        {t('Cancel Order')}
      </Button>
    </StyledModal>
  )
}

const OrderContent = () => {
  const inputCurrency = mainnetTokens.wbnb
  const outputCurrency = mainnetTokens.busd

  return (
    <>
      <Flex width="100%" justifyContent="space-between">
        <CellFormat firstRow={1200} secondRow={<CurrencyFormat currency={inputCurrency} />} />
        <ChevronRightIcon />
        <CellFormat firstRow={1200} secondRow={<CurrencyFormat currency={outputCurrency} />} />
      </Flex>
      <LimitTradeInfoCard
        currentPriceExchangeRateText="0.002474 BNB = 1 BUSD"
        currentPriceExchangeRateTextReversed="404.11169 BUSD = 1 BNB"
        limitPriceExchangeRateText="0.002474 BNB = 1 BUSD"
        limitPriceExchangeRateTextReversed="404.11169 BUSD = 1 BNB"
      />
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
  ({ limitPriceExchangeRateText, limitPriceExchangeRateTextReversed }) => {
    const { t } = useTranslation()

    return (
      <InfoCardWrapper>
        <Box mb="24px">
          <Text fontSize="14px" color="textSubtle">
            {t('Limit Price')}
          </Text>
          <Flex flexDirection="column">
            <Text fontSize="14px">{limitPriceExchangeRateText}</Text>
            <Text fontSize="14px">{limitPriceExchangeRateTextReversed}</Text>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="14px" color="textSubtle">
            {t('Expires on')}
          </Text>
          <Text fontSize="14px">10/14/2021, 12:51AM</Text>
        </Box>
      </InfoCardWrapper>
    )
  },
)
