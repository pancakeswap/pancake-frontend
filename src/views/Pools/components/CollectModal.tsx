import React, { useState, useMemo } from 'react'
import useI18n from 'hooks/useI18n'
import BigNumber from 'bignumber.js'
import { Button, Modal, ButtonMenu, ButtonMenuItem, Flex, HelpIcon, Text, AutoRenewIcon } from '@pancakeswap-libs/uikit'
import Tooltip from 'views/Farms/components/Tooltip/Tooltip'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useSousStake } from 'hooks/useStake'
import { useSousHarvest } from 'hooks/useHarvest'
import { useWeb3React } from '@web3-react/core'

interface CollectModalProps {
  sousId: number
  isBnbPool: boolean
  earnings: BigNumber
  earningsBusd: number
  stakingTokenDecimals?: number
  harvest?: boolean
  onDismiss?: () => void
}

const CollectModal: React.FC<CollectModalProps> = ({
  earnings,
  earningsBusd,
  stakingTokenDecimals,
  sousId,
  isBnbPool,
  harvest = false,
  onDismiss,
}) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const [showCompound, setShowCompound] = useState(!harvest)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(earnings, stakingTokenDecimals)
  }, [earnings, stakingTokenDecimals])

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

    return TranslateString(999, 'Confirm')
  }

  const handleAction = async () => {
    setPendingTx(true)
    if (showCompound) {
      await onStake(fullBalance, stakingTokenDecimals)
    } else {
      await onReward()
    }

    setPendingTx(false)
    onDismiss()
  }

  const handleRenderIcon = () => {
    if (pendingTx) {
      return <AutoRenewIcon color="white" />
    }

    return null
  }

  return (
    <Modal title={TranslateString(1056, 'Collect')} onDismiss={onDismiss}>
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
            <Tooltip
              content={TranslateString(
                999,
                'Compound: collect and restake CAKE into pool Harvest: collect CAKE and send to wallet',
              )}
            >
              <HelpIcon color="textSubtle" />
            </Tooltip>
          </Flex>
        </Flex>
      )}

      <Flex justifyContent="space-between" alignItems="center">
        <Text>{handleRenderLabel()}:</Text>
        <Balance value={Number(fullBalance)} fontSize="16px" />
      </Flex>
      <Flex justifyContent="flex-end" alignItems="center">
        <Balance value={earningsBusd} isDisabled={!earningsBusd} fontSize="12px" prefix="~" />
      </Flex>
      <Button
        mt="24px"
        onClick={handleAction}
        endIcon={handleRenderIcon()}
        disabled={!earnings || pendingTx || !account}
      >
        {handleRenderActionButtonLabel()}
      </Button>
      <Button variant="text">Close Window</Button>
    </Modal>
  )
}

export default CollectModal
