import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Button, Flex, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { useCheckShouldSwitchNetwork } from 'views/universalFarms/hooks'
import { useIsFarmLive } from 'views/universalFarms/hooks/useIsFarmLive'
import { V3StakeModal } from '../Modals/V3StakeModal'
import { StopPropagation } from '../StopPropagation'

type ActionPanelProps = {
  removed: boolean
  outOfRange: boolean
  tokenId?: bigint
  isStaked?: boolean
  detailMode?: boolean
  modalContent: React.ReactNode
  currency0: Currency
  currency1: Currency
  fee: number
  chainId: number
}

export const V3PositionActions = ({
  chainId,
  currency0,
  currency1,
  isStaked,
  removed,
  outOfRange,
  tokenId,
  modalContent,
  detailMode,
  fee,
}: ActionPanelProps) => {
  const { t } = useTranslation()
  const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
    tokenId: tokenId?.toString() ?? '',
    onDone: () => {},
  })
  const stakeModal = useModalV2()
  const { switchNetworkIfNecessary, isLoading: isSwitchingNetwork } = useCheckShouldSwitchNetwork()
  const isFarmLive = useIsFarmLive({
    protocol: Protocol.V3,
    chainId,
    currency0,
    currency1,
    fee,
  })

  const handleStakeAndCheckInactive = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    if (outOfRange && !isStaked) {
      stakeModal.onOpen()
    } else {
      const shouldSwitch = await switchNetworkIfNecessary(currency0.chainId)
      if (!shouldSwitch) {
        await onStake()
      }
    }
  }, [isStaked, onStake, outOfRange, stakeModal, switchNetworkIfNecessary, currency0.chainId])

  const handleStake = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    const shouldSwitch = await switchNetworkIfNecessary(currency0.chainId)
    if (!shouldSwitch) {
      await onStake()
    }
  }, [onStake, switchNetworkIfNecessary, currency0.chainId])

  const handleUnStake = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(currency0.chainId)
    if (!shouldSwitch) {
      await onUnstake()
    }
  }, [onUnstake, switchNetworkIfNecessary, currency0.chainId])

  const handleHarvest = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(currency0.chainId)
    if (!shouldSwitch) {
      await onHarvest()
    }
  }, [onHarvest, switchNetworkIfNecessary, currency0.chainId])

  const stakeButton = useMemo(
    () => (
      <StopPropagation>
        <Button
          scale="md"
          width={['100px']}
          style={{ alignSelf: 'center' }}
          onClick={handleStakeAndCheckInactive}
          disabled={attemptingTxn || isSwitchingNetwork}
        >
          {t('Stake')}
        </Button>
        <V3StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onStake={handleStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </V3StakeModal>
      </StopPropagation>
    ),
    [
      isSwitchingNetwork,
      handleStake,
      handleStakeAndCheckInactive,
      isStaked,
      modalContent,
      t,
      outOfRange,
      stakeModal,
      attemptingTxn,
    ],
  )

  const unstakeButton = useMemo(
    () => (
      <StopPropagation>
        <Button
          scale="md"
          width={['100px']}
          style={{ alignSelf: 'center' }}
          variant="secondary"
          onClick={stakeModal.onOpen}
          disabled={attemptingTxn || isSwitchingNetwork}
        >
          {t('Unstake')}
        </Button>
        <V3StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onUnStake={handleUnStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </V3StakeModal>
      </StopPropagation>
    ),
    [isSwitchingNetwork, handleUnStake, isStaked, modalContent, t, outOfRange, stakeModal, attemptingTxn],
  )

  if (detailMode) {
    return (
      <StopPropagation>
        <ActionPanelContainer>
          {isStaked ? unstakeButton : !removed && isFarmLive ? stakeButton : null}
          {isStaked && !removed ? (
            <Button width={['100px']} scale="md" disabled={attemptingTxn || isSwitchingNetwork} onClick={handleHarvest}>
              {attemptingTxn ? t('Harvesting') : t('Harvest')}
            </Button>
          ) : null}
        </ActionPanelContainer>
      </StopPropagation>
    )
  }
  return (
    <StopPropagation>
      <ActionPanelContainer>
        {!isStaked && !removed && isFarmLive ? stakeButton : null}
        {isStaked && !removed ? (
          <Button width={['100px']} scale="md" disabled={attemptingTxn || isSwitchingNetwork} onClick={handleHarvest}>
            {attemptingTxn ? t('Harvesting') : t('Harvest')}
          </Button>
        ) : null}
      </ActionPanelContainer>
    </StopPropagation>
  )
}

const ActionPanelContainer = styled(Flex)`
  flex-direction: row;
  gap: 8px;
  height: 48px;

  & button {
    flex: 1;
  }
`
