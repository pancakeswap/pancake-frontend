import React from 'react'
import useI18n from 'hooks/useI18n'
import { Modal, Text, Button, OpenNewIcon } from '@pancakeswap-libs/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import useTheme from 'hooks/useTheme'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const TranslateString = useI18n()
  const { theme } = useTheme()

  return (
    <Modal
      title={`${tokenSymbol} ${TranslateString(999, 'required')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Text color="failure" bold>
        {TranslateString(999, 'Insufficient')} {tokenSymbol} {TranslateString(1120, 'balance')}
      </Text>
      <Text mt="24px">{TranslateString(999, `You’ll need ${tokenSymbol} to stake in this pool!`)}</Text>
      <Text>
        {TranslateString(999, `Buy some ${tokenSymbol}, or make sure your ${tokenSymbol} isn’t in another pool or LP.`)}
      </Text>
      <Button mt="24px" as="a" external href={BASE_EXCHANGE_URL}>
        {TranslateString(999, 'Buy')} {tokenSymbol}
      </Button>
      <Button variant="secondary" mt="8px" href="https://yieldwatch.net" as="a" external>
        {TranslateString(999, 'Locate Assets')}
        <OpenNewIcon color="primary" ml="4px" />
      </Button>
      <Button variant="text" onClick={onDismiss}>
        {TranslateString(999, 'Close window')}
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
