import React from 'react'
import { Withdraw } from 'peronio-sdk'
import { Text, ArrowDownIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import { TruncatedText } from './styleds'

export default function WithdrawModalHeader({ withdraw, recipient }: { withdraw: Withdraw; recipient: string | null }) {
  const { t } = useTranslation()

  // const amount = withdraw.inputAmount.toSignificant(6)
  // const { symbol } = withdraw.outputAmount.currency

  // const [estimatedText, transactionRevertText] = withdrawInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={withdraw.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color="primary">
            {withdraw.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {withdraw.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={withdraw.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color="primary">
            {withdraw.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {withdraw.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
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
