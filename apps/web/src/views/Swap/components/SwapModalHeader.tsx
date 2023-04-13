import { ReactElement, useMemo } from 'react'
import { TradeType, CurrencyAmount, Currency, Percent } from '@pancakeswap/sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon, AutoColumn } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@pancakeswap/localization'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { warningSeverity, basisPointsToPercent } from 'utils/exchange'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

export default function SwapModalHeader({
  inputAmount,
  outputAmount,
  tradeType,
  priceImpactWithoutFee,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  allowedSlippage,
}: {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  tradeType: TradeType
  priceImpactWithoutFee?: Percent
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  allowedSlippage: number | ReactElement
}) {
  const { t } = useTranslation()

  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const inputTextColor =
    showAcceptChanges && tradeType === TradeType.EXACT_OUTPUT && isEnoughInputBalance
      ? 'primary'
      : tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance
      ? 'failure'
      : 'text'

  const amount =
    tradeType === TradeType.EXACT_INPUT
      ? formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 6)
      : formatAmount(slippageAdjustedAmounts[Field.INPUT], 6)
  const symbol = tradeType === TradeType.EXACT_INPUT ? outputAmount.currency.symbol : inputAmount.currency.symbol

  const tradeInfoText = useMemo(() => {
    return tradeType === TradeType.EXACT_INPUT
      ? t('Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.', {
          amount,
          symbol,
        })
      : t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
          amount,
          symbol,
        })
  }, [t, tradeType, amount, symbol])

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color={inputTextColor}>
            {formatAmount(inputAmount, 6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <CurrencyLogo currency={outputAmount.currency} size="24px" />
          <TruncatedText
            fontSize="24px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {formatAmount(outputAmount, 6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed>
          <Text fontSize="24px" ml="10px">
            {outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> {t('Price Updated')}</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>{t('Accept')}</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        <RowFixed style={{ width: '100%' }}>
          <Text color="secondary" bold textTransform="uppercase">
            {t('Slippage Tolerance')}
          </Text>
          <Text bold color="primary" ml="auto" textAlign="end">
            {typeof allowedSlippage === 'number'
              ? `${basisPointsToPercent(allowedSlippage).toFixed(2)}%`
              : allowedSlippage}
          </Text>
        </RowFixed>
        {tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance && (
          <Text small color="failure" textAlign="left" style={{ width: '100%' }}>
            {t('Insufficient input token balance. Your transaction may fail.')}
          </Text>
        )}
        <Text small color="textSubtle" textAlign="left" style={{ maxWidth: '320px' }}>
          {tradeInfoText}
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
