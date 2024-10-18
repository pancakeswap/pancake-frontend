import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { ArrowDownIcon, AutoColumn, Button, ErrorIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { warningSeverity } from 'utils/exchange'
import { SwapShowAcceptChanges, TruncatedText } from './styleds'

export default function SwapModalHeaderV2({
  inputAmount,
  outputAmount,
  tradeType,
  currencyBalances,
  priceImpactWithoutFee,
  isEnoughInputBalance,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  currencyBalances?: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  tradeType: TradeType
  priceImpactWithoutFee?: Percent
  isEnoughInputBalance?: boolean
  recipient?: string
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const { t } = useTranslation()

  const { isMobile } = useMatchBreakpoints()

  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const displayDecimals = isMobile ? 6 : 12

  const inputTextColor =
    showAcceptChanges && tradeType === TradeType.EXACT_OUTPUT && isEnoughInputBalance
      ? 'primary'
      : tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance
      ? 'failure'
      : 'text'

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
            {formatAmount(inputAmount, displayDecimals)}
          </TruncatedText>
        </RowFixed>
        <RowFixed style={{ alignSelf: 'center' }}>
          <Text fontSize="18px" ml="10px" mr="8px" bold>
            {inputAmount.currency.symbol}
          </Text>
          <CurrencyLogo currency={currencyBalances?.INPUT?.currency ?? inputAmount.currency} size="24px" />
        </RowFixed>
      </RowBetween>
      <RowFixed margin="auto">
        <ArrowDownIcon width="24px" ml="4px" color="textSubtle" />
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
            {formatAmount(outputAmount, displayDecimals)}
          </TruncatedText>
        </RowFixed>
        <RowFixed style={{ alignSelf: 'center' }}>
          <Text fontSize="18px" ml="10px" mr="8px" bold>
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
        {tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance && (
          <Text fontSize={12} color="failure" textAlign="left" style={{ width: '100%' }}>
            {t('Insufficient input token balance. Your transaction may fail.')}
          </Text>
        )}
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
