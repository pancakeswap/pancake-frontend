import React, { useState } from 'react'
import {
  Modal,
  Text,
  Button,
  Heading,
  Flex,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
  Box,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import { useSousHarvest } from 'hooks/useHarvest'
import { useSousStake } from 'hooks/useStake'
import useToast from 'hooks/useToast'
import { Token } from 'config/constants/types'

interface CollectModalProps {
  formattedBalance: string
  fullBalance: string
  earningToken: Token
  earningsDollarValue: string
  sousId: number
  isBnbPool: boolean
  isCompoundPool?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  formattedBalance,
  fullBalance,
  earningToken,
  earningsDollarValue,
  sousId,
  isBnbPool,
  isCompoundPool = false,
  onDismiss,
}) => {
  const TranslateString = useI18n()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const [pendingTx, setPendingTx] = useState(false)
  const [shouldCompound, setShouldCompound] = useState(isCompoundPool)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Box mb="12px">{TranslateString(999, 'Compound: collect and restake CAKE into pool.')}</Box>
      <Box>{TranslateString(999, 'Harvest: collect CAKE and send to wallet')}</Box>
    </>,
    'bottom-end',
    'hover',
    undefined,
    undefined,
    [20, 10],
  )

  const handleHarvestConfirm = async () => {
    setPendingTx(true)
    // compounding
    if (shouldCompound) {
      try {
        await onStake(fullBalance, earningToken.decimals)
        toastSuccess(
          `${TranslateString(999, 'Compounded')}!`,
          TranslateString(999, `Your ${earningToken.symbol} earnings have been re-invested into the pool!`),
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
    } else {
      // harvesting
      try {
        await onReward()
        toastSuccess(
          `${TranslateString(999, 'Harvested')}!`,
          TranslateString(999, `Your ${earningToken.symbol} earnings have been sent to your wallet!`),
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
  }

  return (
    <Modal
      title={`${earningToken.symbol} ${TranslateString(562, 'Harvest')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isCompoundPool && (
        <Flex justifyContent="center" alignItems="center" mb="24px">
          <ButtonMenu
            activeIndex={shouldCompound ? 0 : 1}
            scale="sm"
            variant="subtle"
            onItemClick={(index) => setShouldCompound(!index)}
          >
            <ButtonMenuItem as="button">{TranslateString(704, 'Compound')}</ButtonMenuItem>
            <ButtonMenuItem as="button">{TranslateString(562, 'Harvest')}</ButtonMenuItem>
          </ButtonMenu>
          <Flex ml="10px" ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </Flex>
          {tooltipVisible && tooltip}
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center" mb="24px">
        <Text>{shouldCompound ? TranslateString(999, 'Compounding') : TranslateString(999, 'Harvesting')}:</Text>
        <Flex flexDirection="column">
          <Heading>
            {formattedBalance} {earningToken.symbol}
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
      </Button>
      <Button variant="text" onClick={onDismiss} pb="0px">
        {TranslateString(999, 'Close window')}
      </Button>
    </Modal>
  )
}

export default CollectModal
