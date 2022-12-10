import styled from 'styled-components'
import { Text, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, ColumnCenter } from 'components/Layout/Column'
import { AkkaRouterTrade } from '../hooks/types'
import { useCurrency } from 'hooks/Tokens'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'

const Wrapper = styled.div`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

function AkkaConfirmationPendingContent({ trade }: { trade: AkkaRouterTrade }) {
  const { t } = useTranslation()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  // text to show while loading
  const pendingText = t('Swapping %amountA% %symbolA% for %amountB% %symbolB%', {
    amountA: trade?.route?.inputAmount ?? '',
    symbolA: inputCurrency?.symbol ?? '',
    amountB: trade?.route?.returnAmount ?? '',
    symbolB: outputCurrency?.symbol ?? '',
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

export default AkkaConfirmationPendingContent
