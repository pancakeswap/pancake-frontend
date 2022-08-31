import React from 'react'
import { Mint } from 'peronio-sdk'
import { Text, ArrowDownIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import { TruncatedText } from './styleds'

export default function MintModalHeader({ mint, recipient }: { mint: Mint; recipient: string | null }) {
  const { t } = useTranslation()

  // const amount = mint.inputAmount.toSignificant(6)
  // const { symbol } = mint.outputAmount.currency

  // const [estimatedText, transactionRevertText] = mintInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={mint.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color="primary">
            {mint.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {mint.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={mint.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color="primary">
            {mint.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {mint.outputAmount.currency.symbol}
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
