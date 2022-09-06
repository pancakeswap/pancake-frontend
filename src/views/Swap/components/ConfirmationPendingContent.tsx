import styled from 'styled-components'
import { Text, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import { Trade, Currency, TradeType } from '@pancakeswap/sdk'
import { StableTrade } from '../StableSwap/hooks/useStableTradeExactIn'

const Wrapper = styled.div`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

function ConfirmationPendingContent({ trade }: { trade: Trade<Currency, Currency, TradeType> | StableTrade }) {
  const { t } = useTranslation()

  // text to show while loading
  const pendingText = t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: trade?.inputAmount?.toSignificant(6) ?? '',
    symbolA: trade?.inputAmount?.currency?.symbol ?? '',
    amountB: trade?.outputAmount?.toSignificant(6) ?? '',
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
