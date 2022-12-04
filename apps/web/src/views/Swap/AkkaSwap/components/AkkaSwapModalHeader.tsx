import { useMemo } from 'react'
import { Trade, TradeType, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@pancakeswap/localization'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { AkkaRouterTrade } from '../hooks/types'

export default function AkkaSwapModalHeader({
  trade,
  isEnoughInputBalance,
  recipient,
  onAcceptChanges,
  allowedSlippage,
}: {
  trade: AkkaRouterTrade
  isEnoughInputBalance: boolean
  recipient: string | null
  onAcceptChanges: () => void
  allowedSlippage: number
}) {
  const { t } = useTranslation()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const inputTextColor = 'text'

  const amount = trade?.route?.inputAmount
  const symbol = inputCurrency.symbol

  const tradeInfoText = t('Output is estimated. You will receive at least or the transaction will revert.')

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color={inputTextColor}>
            {trade.route.inputAmount}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {inputCurrency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={outputCurrency} size="24px" />
          <TruncatedText fontSize="24px" color='text'>
            {trade.route.returnAmount}
          </TruncatedText>
        </RowFixed>
        <RowFixed>
          <Text fontSize="24px" ml="10px">
            {outputCurrency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        <RowFixed style={{ width: '100%' }}>
          <Text color="secondary" bold textTransform="uppercase">
            {t('Slippage Tolerance')}
          </Text>
          <Text bold color="primary" ml="auto" textAlign="end">
            {`${allowedSlippage / 100}%`}
          </Text>
        </RowFixed>
        <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
          {estimatedText}
          {transactionRevertText}
        </Text>
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
