import React from 'react'
import { Flex, Text, Button, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface ConfirmStageProps {
  isConfirming: boolean
  handleConfirm: () => void
}

// Shown in case user wants to pay with BNB
// or if user wants to pay with WBNB and it is already approved
const ConfirmStage: React.FC<ConfirmStageProps> = ({ isConfirming, handleConfirm }) => {
  const { t } = useTranslation()
  return (
    <Flex p="16px" flexDirection="column">
      <Flex alignItems="center">
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Text fontSize="20px" bold color="secondary">
              {t('Confirm')}
            </Text>
          </Flex>
          <Text small color="textSubtle">
            {t('Please confirm the transaction in your wallet')}
          </Text>
        </Flex>
        <Flex flex="0 0 64px" height="72px" width="64px">
          {isConfirming && <Spinner size={64} />}
        </Flex>
      </Flex>
      <Button mt="24px" disabled={isConfirming} onClick={handleConfirm} variant="secondary">
        {t('Confirm')}
      </Button>
    </Flex>
  )
}

export default ConfirmStage
