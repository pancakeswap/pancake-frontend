import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { ArrowDownIcon, AutoColumn, Button, ErrorIcon, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { ReactElement, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { basisPointsToPercent, warningSeverity } from 'utils/exchange'
import { SlippageAdjustedAmounts } from '../V3Swap/utils/exchange'
import { SwapShowAcceptChanges, TruncatedText } from './styleds'

export default function SwapModalHeader({
  inputAmount,
  outputAmount,
  tradeType,
  currencyBalances,
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
  currencyBalances?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  tradeType: TradeType
  priceImpactWithoutFee?: Percent
  slippageAdjustedAmounts: SlippageAdjustedAmounts | undefined | null
  isEnoughInputBalance?: boolean
  recipient?: string
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
      ? formatAmount(slippageAdjustedAmounts?.[Field.OUTPUT], 6)
      : formatAmount(slippageAdjustedAmounts?.[Field.INPUT], 6)
  const symbol = tradeType === TradeType.EXACT_INPUT ? outputAmount.currency.symbol : inputAmount.currency.symbol

  const tradeInfoText = useMemo(() => {
    return tradeType === TradeType.EXACT_INPUT
      ? t('Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.', {
          amount: `${amount}`,
          symbol,
        })
      : t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
          amount: `${amount}`,
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
          <TruncatedText fontSize="24px" bold color={inputTextColor}>
            {formatAmount(inputAmount, 6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed style={{ alignSelf: 'center' }}>
          <Text fontSize="14px" ml="10px" mr="8px">
            {inputAmount.currency.symbol}
          </Text>
          <CurrencyLogo currency={currencyBalances?.INPUT?.currency ?? inputAmount.currency} size="24px" />
        </RowFixed>
      </RowBetween>
      <RowFixed margin="auto">
        <ArrowDownIcon width="24px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="4px">
          <TruncatedText
            bold
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
        <RowFixed style={{ alignSelf: 'center' }}>
          <Text fontSize="14px" ml="10px" mr="8px">
            {outputAmount.currency.symbol}
          </Text>
          <CurrencyLogo currency={currencyBalances?.OUTPUT?.currency ?? outputAmount.currency} size="24px" />
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
          <Text fontSize={12} color="secondary" bold textTransform="uppercase">
            {t('Slippage Tolerance')}
          </Text>
          <Text fontSize={12} bold color="primary" ml="auto" textAlign="end">
            {typeof allowedSlippage === 'number'
              ? `${basisPointsToPercent(allowedSlippage).toFixed(2)}%`
              : allowedSlippage}
          </Text>
        </RowFixed>
        {tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance && (
          <Text fontSize={12} color="failure" textAlign="left" style={{ width: '100%' }}>
            {t('Insufficient input token balance. Your transaction may fail.')}
          </Text>
        )}
        <Text fontSize={12} color="textSubtle" textAlign="left" style={{ maxWidth: '320px' }}>
          {tradeInfoText}
        </Text>
      </AutoColumn>
      {recipient ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text fontSize={12} color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
