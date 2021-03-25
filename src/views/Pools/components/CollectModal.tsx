import React, { useState, useMemo } from 'react'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import { Button, Modal, ButtonMenu, ButtonMenuItem, Flex, HelpIcon, Text, RefreshIcon } from '@pancakeswap-libs/uikit'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useSousStake } from 'hooks/useStake'
import { useSousHarvest } from 'hooks/useHarvest'
import useTheme from 'hooks/useTheme'
import { useToast } from 'state/hooks'

import ConfirmButton from './ConfirmButton'

interface CollectModalProps {
  sousId: number
  isBnbPool: boolean
  earnings: BigNumber
  earningsBusd: number
  earningTokenDecimals?: number
  earningTokenName: string
  harvest?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  earnings,
  earningsBusd,
  earningTokenName,
  earningTokenDecimals,
  sousId,
  isBnbPool,
  harvest = false,
  onDismiss,
}) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const [confirmedTx, setConfirmedTx] = useState(false)

  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()

  const [showCompound, setShowCompound] = useState(!harvest)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(earnings, earningTokenDecimals)
  }, [earnings, earningTokenDecimals])

  const handleRenderLabel = () => {
    if (showCompound) {
      return TranslateString(999, 'Compounding')
    }

    return TranslateString(999, 'Harvesting')
  }

  const handleRenderActionButtonLabel = () => {
    if (pendingTx) {
      return TranslateString(999, 'Confirming')
    }

    if (confirmedTx) {
      return TranslateString(999, 'Confirmed')
    }

    return TranslateString(999, 'Confirm')
  }

  const handleAction = async () => {
    setPendingTx(true)
    if (showCompound) {
      try {
        await onStake(fullBalance, earningTokenDecimals)
        toastSuccess(
          `${TranslateString(1074, 'Staked')}!`,
          TranslateString(999, 'Your funds have been staked in the pool!'),
        )
        setConfirmedTx(true)
      } catch (e) {
        toastError(
          TranslateString(999, 'Canceled'),
          TranslateString(999, 'Please try again and confirm the transaction.'),
        )
      }
    } else {
      try {
        await onReward()
        toastSuccess(
          `${TranslateString(999, 'Harvested')}!`,
          TranslateString(999, 'Your earnings have been sent to your wallet!'),
        )
        setConfirmedTx(true)
      } catch (e) {
        toastError(
          TranslateString(999, 'Canceled'),
          TranslateString(999, 'Please try again and confirm the transaction.'),
        )
      }
    }

    setPendingTx(false)
  }

  const handleRenderIcon = () => {
    if (pendingTx) {
      return <RefreshIcon color="white" />
    }

    return null
  }

  return (
    <Modal
      title={harvest ? TranslateString(562, 'Harvest') : TranslateString(1056, 'Collect')}
      onDismiss={onDismiss}
      minWidth="280px"
      headerBackground={theme.card.cardHeaderBackground}
    >
      {!harvest && (
        <Flex justifyContent="center" alignItems="center" mb="24px">
          <ButtonMenu
            activeIndex={showCompound ? 0 : 1}
            scale="sm"
            variant="subtle"
            onItemClick={(index) => setShowCompound(!index)}
          >
            <ButtonMenuItem as="button">{TranslateString(704, 'Compound')}</ButtonMenuItem>
            <ButtonMenuItem as="button">{TranslateString(562, 'Harvest')}</ButtonMenuItem>
          </ButtonMenu>
          <Flex ml="10px">
            <HelpIcon color="textSubtle" />
          </Flex>
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center">
        <Text>{handleRenderLabel()}:</Text>
        <Balance value={Number(fullBalance)} fontSize="16px" unit={` ${earningTokenName}`} decimals={4} />
      </Flex>
      <Flex justifyContent="flex-end" alignItems="center">
        <Balance
          value={earningsBusd}
          isDisabled={!earningsBusd}
          fontSize="12px"
          prefix="~"
          unit=" USD"
          bold={false}
          color="textSubtle"
        />
      </Flex>
      <ConfirmButton
        mt="24px"
        onClick={handleAction}
        endIcon={handleRenderIcon()}
        disabled={!earnings || pendingTx}
        isLoading={pendingTx}
        isConfirmed={confirmedTx}
      >
        {handleRenderActionButtonLabel()}
      </ConfirmButton>
      <Button variant="text" onClick={onDismiss}>
        Close Window
      </Button>
    </Modal>
  )
}

export default CollectModal
