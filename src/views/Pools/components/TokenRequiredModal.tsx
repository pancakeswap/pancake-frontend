import React from 'react'
import useI18n from 'hooks/useI18n'
import { Modal, Text, Button, OpenNewIcon } from '@pancakeswap-libs/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import { Token } from 'config/constants/types'

interface TokenRequiredModalProps {
  token: Token
  onDismiss?: () => void
}

const TokenRequiredModal: React.FC<TokenRequiredModalProps> = ({ token, onDismiss }) => {
  const TranslateString = useI18n()
  const tokenSymbol = token.symbol

  return (
    <Modal title={`${tokenSymbol} ${TranslateString(999, 'required')}`} onDismiss={onDismiss} minWidth="288px">
      <Text color="failure" bold>
        {TranslateString(999, 'Insufficient')} {tokenSymbol} {TranslateString(999, 'balance')}
      </Text>
      <Text mt="24px">{TranslateString(999, `You’ll need ${tokenSymbol} to stake in this pool!`)}</Text>
      <Text>
        {TranslateString(999, `Buy ${tokenSymbol}, or make sure your ${tokenSymbol} isn’t in another pool or LP.`)}
      </Text>
      <Button mt="24px" as="a" external href={BASE_EXCHANGE_URL}>
        {TranslateString(999, 'Buy')} {token.symbol}
      </Button>
      <Button variant="secondary" mt="8px" href="https://yieldwatch.net" as="a" external>
        {TranslateString(999, 'Locate Assets')}
        <OpenNewIcon color="primary" ml="4px" />
      </Button>
    </Modal>
  )
}

export default TokenRequiredModal
