import React, { useState } from 'react'
import { Modal, Text, Button, OpenNewIcon, Heading, Flex, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import { useSousHarvest } from 'hooks/useHarvest'
import { useToast } from 'state/hooks'

interface CollectModalProps {
  tokenSymbol: string
  formattedBalance: string
  earningsDollarValue: string
  sousId: number
  isBnbPool: boolean
  isCompoundPool: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  tokenSymbol,
  formattedBalance,
  earningsDollarValue,
  sousId,
  isBnbPool,
  isCompoundPool,
  onDismiss,
}) => {
  const TranslateString = useI18n()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const handleHarvestConfirm = async () => {
    setPendingTx(true)

    try {
      await onReward()
      toastSuccess(
        `${TranslateString(999, 'Harvested')}!`,
        TranslateString(999, 'Your earnings have been sent to your wallet!'),
      )
      setPendingTx(false)
      onDismiss()
    } catch (e) {
      toastError(
        TranslateString(999, 'Canceled'),
        TranslateString(999, 'Please try again and confirm the transaction.'),
      )
      setPendingTx(false)
    }
  }

  return (
    <Modal
      title={`${tokenSymbol} ${TranslateString(562, 'Harvest')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>{TranslateString(999, 'Harvesting')}:</Text>
        <Flex flexDirection="column">
          <Heading>
            {formattedBalance} {tokenSymbol}
          </Heading>
          <Text fontSize="12px" color="textSubtle">{`~${earningsDollarValue || 0} USD`}</Text>
        </Flex>
      </Flex>

      <Button
        mt="8px"
        onClick={handleHarvestConfirm}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        {pendingTx ? TranslateString(802, 'Confirming') : TranslateString(464, 'Confirm')}
        <OpenNewIcon color="primary" ml="4px" />
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {TranslateString(999, 'Close window')}
      </Button>
    </Modal>
  )
}

export default CollectModal
