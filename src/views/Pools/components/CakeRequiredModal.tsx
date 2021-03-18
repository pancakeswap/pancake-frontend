import React from 'react'
import useI18n from 'hooks/useI18n'
import { Modal, Text, Button, OpenNewIcon } from '@pancakeswap-libs/uikit'
import { BASE_EXCHANGE_URL } from 'config'

interface CakeRequiredModalProps {
  onDismiss?: () => void
}

const CakeRequiredModal: React.FC<CakeRequiredModalProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()
  return (
    <Modal title={TranslateString(999, 'CAKE required')} onDismiss={onDismiss}>
      <Text color="failure" bold>
        {TranslateString(999, 'Insufficient CAKE balance')}
      </Text>
      <Text mt="24px">{TranslateString(999, 'You’ll need CAKE to stake in this pool!')}</Text>
      <Text>{TranslateString(999, 'Buy CAKE, or make sure your CAKE isn’t in another pool or LP.')}</Text>
      <Button mt="24px" as="a" external href={BASE_EXCHANGE_URL}>
        {TranslateString(999, 'Buy CAKE')}
      </Button>
      <Button variant="secondary" mt="8px" href="https://yieldwatch.net" as="a" external>
        {TranslateString(999, 'Locate Assets')}
        <OpenNewIcon color="primary" ml="4px" />
      </Button>
    </Modal>
  )
}

export default CakeRequiredModal
