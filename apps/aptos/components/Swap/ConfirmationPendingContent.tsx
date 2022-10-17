import styled from 'styled-components'
import { Text, Spinner, AutoColumn, ColumnCenter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Trade, Currency, TradeType } from '@pancakeswap/aptos-swap-sdk'
import formatAmountDisplay from 'utils/formatAmountDisplay'

const Wrapper = styled.div`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

function ConfirmationPendingContent({ trade }: { trade: Trade<Currency, Currency, TradeType> }) {
  const { t } = useTranslation()

  // text to show while loading
  const pendingText = t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: formatAmountDisplay(trade?.inputAmount),
    symbolA: trade?.inputAmount?.currency?.symbol ?? '',
    amountB: formatAmountDisplay(trade?.outputAmount),
    symbolB: trade?.outputAmount?.currency?.symbol ?? '',
  })

  return (
    <Wrapper>
      <ConfirmedIcon>
        <Spinner />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="20px">{t('Waiting For Confirmation')}</Text>
        <AutoColumn gap="12px" justify="center">
          <Text bold small textAlign="center">
            {pendingText}
          </Text>
        </AutoColumn>
        <Text small color="textSubtle" textAlign="center">
          {t('Confirm this transaction in your wallet')}
        </Text>
      </AutoColumn>
    </Wrapper>
  )
}

export default ConfirmationPendingContent
